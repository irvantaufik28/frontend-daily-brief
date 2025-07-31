import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import "../styles/reportformfilter.css";
import CardTitleFormFilter from "../../../components/Card/CardTitleFormFilter";
import config from "../../../config";
import axios from "axios";
import Select from "react-select";

const ReportFromFilter = ({ onFilter }) => {
    const [companyOptions, setCompanyOptions] = useState([]);
    const [projectOptions, setProjectOptions] = useState([]);
    const [personOptions, setPersonOptions] = useState([]);
    const [isLoadingPerson, setIsLoadingPerson] = useState(true);
    const [isLoadingCompany, setIsLoadingCompany] = useState(true);

    const [companyProjectMap, setCompanyProjectMap] = useState({});

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

                const map = {};
                companyData.forEach((company) => {
                    map[company.id] = company.projects.map((p) => ({
                        value: p.id,
                        label: p.title,
                    }));
                });

                setCompanyOptions(companies);
                setCompanyProjectMap(map);
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

    const [filters, setFilters] = useState({
        reportDate: "",
        companyId: null,
        projectId: null,
        personId: null,
    });

    const handleCompanyChange = (selected) => {
        setFilters((prev) => ({
            ...prev,
            companyId: selected,
            projectId: null, // Reset project
        }));

        if (selected) {
            setProjectOptions(companyProjectMap[selected.value] || []);
        } else {
            setProjectOptions([]);
        }
    };

    const handleProjectChange = (selected) => {
        setFilters((prev) => ({
            ...prev,
            projectId: selected,
        }));
    };

    const handlePersonChange = (selected) => {
        setFilters((prev) => ({
            ...prev,
            personId: selected,
        }));
    };

    const handleDateChange = (e) => {
        setFilters((prev) => ({
            ...prev,
            reportDate: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter({
            reportDate: filters.reportDate,
            companyId: filters.companyId?.value || null,
            projectId: filters.projectId?.value || null,
            personId: filters.personId?.value || null,
        });
    };

    const handleReset = () => {
        setFilters({
            reportDate: "",
            companyId: null,
            projectId: null,
            personId: null,
        });
        setProjectOptions([]);
        onFilter({
            reportDate: "",
            companyId: null,
            projectId: null,
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
                                placeholder="Select or search name"
                                onChange={handlePersonChange}
                                value={filters.personId}
                            />
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
                                onChange={handleCompanyChange}
                                value={filters.companyId}
                            />
                        </Form.Group>
                    </div>

                    <div className="col-md-3">
                        <Form.Group>
                            <Form.Label className="form-filter-label">Project</Form.Label>
                            <Select
                                options={projectOptions}
                                isClearable
                                placeholder="Select project"
                                onChange={handleProjectChange}
                                value={filters.projectId}
                                isDisabled={!filters.companyId}
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
                                onChange={handleDateChange}
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

export default ReportFromFilter;
