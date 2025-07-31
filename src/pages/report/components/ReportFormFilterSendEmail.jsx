import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import "../styles/reportformfilter.css";
import CardTitleFormFilter from "../../../components/Card/CardTitleFormFilter";
import Select from "react-select";
import axios from "axios";
import config from "../../../config";

const ReportFormFilterSendEmail = ({ onFilter }) => {
    const [companyOptions, setCompanyOptions] = useState([]);
    const [personOptions, setPersonOptions] = useState([]);
    const [isLoadingCompany, setIsLoadingCompany] = useState(true);
    const [isLoadingPerson, setIsLoadingPerson] = useState(true);

    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

    const [filters, setFilters] = useState({
        reportDate: "",
        EmailStatus: "",
        companyId: null,
        personId: null,
    });

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get(config.apiUrl + "/company-list", {
                    headers: { Authorization: token },
                });
                const mapped = res.data.data.map((company) => ({
                    value: company.id,
                    label: company.name,
                }));
                setCompanyOptions(mapped);
            } catch (error) {
                console.error("Failed to fetch companies", error);
            } finally {
                setIsLoadingCompany(false);
            }
        };

        const fetchPersons = async () => {
            try {
                const res = await axios.get(config.apiUrl + "/person-list", {
                    headers: { Authorization: token },
                });
                const mapped = res.data.data.map((person) => ({
                    value: person.id,
                    label: person.fullName,
                }));
                setPersonOptions(mapped);
            } catch (error) {
                console.error("Failed to fetch persons", error);
            } finally {
                setIsLoadingPerson(false);
            }
        };

        fetchCompanies();
        fetchPersons();
    }, [token]);

    const handleSelectChange = (name, selected) => {
        setFilters((prev) => ({
            ...prev,
            [name]: selected,
        }));
    };

    const handleInputChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter({
            reportDate: filters.reportDate,
            EmailStatus: filters.EmailStatus,
            companyId: filters.companyId?.value || null,
            personId: filters.personId?.value || null,
        });
    };

    const handleReset = () => {
        setFilters({
            reportDate: "",
            EmailStatus: "",
            companyId: null,
            personId: null,
        });
        onFilter({
            reportDate: "",
            EmailStatus: "",
            companyId: null,
            personId: null,
        });
    };

    return (
        <CardTitleFormFilter title={"Reports Table"}>
            <Form onSubmit={handleSubmit} className="mb-3">
                <div className="row align-items-end person-coloum-filter">
                    <div className="col-md-3">
                        <Form.Group>
                            <Form.Label className="form-filter-label">Name</Form.Label>
                            <Select
                                options={personOptions}
                                isLoading={isLoadingPerson}
                                isClearable
                                placeholder="Select name"
                                onChange={(selected) => handleSelectChange("personId", selected)}
                                value={filters.personId}
                            />
                        </Form.Group>
                    </div>

                    <div className="col-md-3">
                        <Form.Group>
                            <Form.Label className="form-filter-label">Email Status</Form.Label>
                            <Form.Control
                                as="select"
                                name="EmailStatus"
                                value={filters.EmailStatus}
                                onChange={handleInputChange}
                            >
                                <option value="">-- All --</option>
                                <option value="PENDING">PENDING</option>
                                <option value="SUCCESS">SUCCESS</option>
                                <option value="FAILED">FAILED</option>
                            </Form.Control>
                        </Form.Group>
                    </div>

                    <div className="col-md-3">
                        <Form.Group>
                            <Form.Label className="form-filter-label">Company</Form.Label>
                            <Select
                                options={companyOptions}
                                isLoading={isLoadingCompany}
                                isClearable
                                placeholder="Select company"
                                onChange={(selected) => handleSelectChange("companyId", selected)}
                                value={filters.companyId}
                            />
                        </Form.Group>
                    </div>

                    <div className="col-md-3">
                        <Form.Group>
                            <Form.Label className="form-filter-label">Report Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="reportDate"
                                value={filters.reportDate}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </div>

                    <div className="col-md-3 mt-3">
                        <Button variant="primary" type="submit" className="me-2">
                            Search
                        </Button>
                        <Button variant="secondary" onClick={handleReset}>
                            Reset
                        </Button>
                    </div>
                </div>
            </Form>
        </CardTitleFormFilter>
    );
};

export default ReportFormFilterSendEmail;
