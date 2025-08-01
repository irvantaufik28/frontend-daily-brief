import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import CardTitleFormFilter from "../../../components/Card/CardTitleFormFilter";
import config from "../../../config";
import axios from "axios";
import Select from "react-select";

const ProjectMemberFormFilter = ({ onFilter, onReset }) => {
    const [companyOptions, setCompanyOptions] = useState([]);
    const [projectOptions, setProjectOptions] = useState([]);
    const [isLoadingCompany, setIsLoadingCompany] = useState(true);
    const [companyProjectMap, setCompanyProjectMap] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

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



        fetchCompanies();

    }, [token]);

    const [filters, setFilters] = useState({
        projectId: null,

    });

    const handleCompanyChange = (selected) => {
        setFilters((prev) => ({
            ...prev,
            companyId: selected,
            projectId: null,
        }));
        setErrorMessage(""); // Clear error
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
        setErrorMessage(""); // Clear error
    };

    const handleSubmit = (e) => {
        e.preventDefault();


        if (!filters.projectId) {
            setErrorMessage("Please select a Project before searching.");
            return;
        }

        setErrorMessage("");
        onFilter({
            projectId: filters.projectId?.value || null,

        });
    };

    const handleReset = () => {
        setFilters({
            projectId: null,
            companyId: null,
        });
        setProjectOptions([]);
        setErrorMessage("");

        onReset?.(); // Panggil reset dari parent
    };

    return (

        <CardTitleFormFilter title={"Project Member"}>
            {errorMessage && (
                <div className="col-md-12 mb-2">
                    <div className="alert alert-warning text-center py-2 mb-2">
                        {errorMessage}
                    </div>
                </div>
            )}
            <Form onSubmit={handleSubmit} className="mb-3">
                <div className="row align-items-end person-coloum-filter">
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

export default ProjectMemberFormFilter;
