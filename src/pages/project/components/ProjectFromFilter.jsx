import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import CardTitleFormFilter from "../../../components/Card/CardTitleFormFilter";
import config from "../../../config";

const ProjectFormFilter = ({ onFilter }) => {
    const [filters, setFilters] = useState({
        title: "",
        companyId: "",
        status: "",
    });

    const [companyOptions, setCompanyOptions] = useState([]);
    const [isLoadingCompany, setIsLoadingCompany] = useState(true);

    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get(config.apiUrl + "/company-list", {
                    headers: { Authorization: token },
                });

                const companyData = res.data.data;
                const companies = companyData.map((c) => ({
                    value: c.id,
                    label: c.name,
                }));

                setCompanyOptions(companies);
            } catch (error) {
                console.error("Failed to fetch companies", error);
            } finally {
                setIsLoadingCompany(false);
            }
        };

        fetchCompanies();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (selectedOption, { name }) => {
        setFilters((prev) => ({
            ...prev,
            [name]: selectedOption ? parseInt(selectedOption.value) : "",
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter(filters);
    };

    const handleReset = () => {
        const resetFilters = {
            title: "",
            companyId: "",
            status: "",
        };
        setFilters(resetFilters);
        onFilter(resetFilters);
    };

    return (
        <CardTitleFormFilter title="Project Table">
            <Form onSubmit={handleSubmit} className="mb-3">
                <div className="row align-items-end global-coloum-filter">
                    <div className="col-md-3">
                        <Form.Group controlId="filterTitle">
                            <Form.Label className="form-filter-label">Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter project title"
                                name="title"
                                value={filters.title}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </div>
                    <div className="col-md-3">
                        <Form.Group controlId="filterCompany">
                            <Form.Label className="form-filter-label">Company</Form.Label>
                            <Select
                                name="companyId"
                                options={companyOptions}
                                isLoading={isLoadingCompany}
                                isClearable
                                placeholder="Select company"
                                onChange={handleSelectChange}
                                value={
                                    companyOptions.find(
                                        (opt) => opt.value === Number(filters.companyId)
                                    ) || null
                                }
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                        </Form.Group>
                    </div>
                    <div className="col-md-3">
                        <Form.Group controlId="filterStatus">
                            <Form.Label className="form-filter-label">Status</Form.Label>
                            <Form.Control
                                as="select"
                                name="status"
                                value={filters.status}
                                onChange={handleChange}
                            >
                                <option value="">-- All --</option>
                                <option value="ONGOING">ONGOING</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="CANCELLED">CANCELLED</option>
                            </Form.Control>
                        </Form.Group>
                    </div>
                    <div className="col-md-3">
                        <div className="ms-auto">
                            <Button variant="primary" type="submit" className="me-2">
                                Search
                            </Button>
                            <Button variant="secondary" onClick={handleReset}>
                                Reset
                            </Button>
                        </div>
                    </div>
                </div>
            </Form>
        </CardTitleFormFilter>
    );
};

export default ProjectFormFilter;
