import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import "../styles/reportformfilter.css";
import CardTitleFormFilter from "../../../components/Card/CardTitleFormFilter";

const ReportFromFilter = ({ onFilter }) => {
    // Dummy data
    const companyList = [
        { id: 1, name: "PT. Indah Sari" },
        { id: 2, name: "PT. Coderein" },
        { id: 3, name: "PT. Greenlab" },
    ];


    const peopleList = [
        { id: 5, name: "Irvan Taufik" },
        { id: 2, name: "Ayu Puspita" },
        { id: 3, name: "Budi Santoso" },
    ];

    const [filters, setFilters] = useState({
        reportDate: "",
        EmailStatus: "",
        company_id: "",
        person_id: "",
    });

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter(filters);
    };

    const handleReset = () => {
        const resetFilters = {
            reportDate: "",
            EmailStatus: "",
            company_id: "",
            person_id: "",
        };
        setFilters(resetFilters);
        onFilter(resetFilters);
    };

    return (
        <CardTitleFormFilter title={"Reports Table"}>
            <Form onSubmit={handleSubmit} className="mb-3">
                <div className="row align-items-end person-coloum-filter">
                    <div className="col-md-3">
                        <Form.Group controlId="person_id">
                            <Form.Label className="form-filter-label">Name</Form.Label>
                            <Form.Control
                                as="select"
                                name="person_id"
                                value={filters.person_id}
                                onChange={handleChange}
                            >
                                <option value="">-- All People --</option>
                                {peopleList.map((person) => (
                                    <option key={person.id} value={person.id}>
                                        {person.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </div>

                    <div className="col-md-3">
                        <Form.Group controlId="EmailStatus">
                            <Form.Label className="form-filter-label">Email Status</Form.Label>
                            <Form.Control
                                as="select"
                                name="EmailStatus"
                                value={filters.EmailStatus}
                                onChange={handleChange}
                            >
                                <option value="">-- All --</option>
                                <option value="PENDING">PENDING</option>
                                <option value="SUCCESS">SUCCESS</option>
                                <option value="FAILED">FAILED</option>
                            </Form.Control>
                        </Form.Group>
                    </div>

                    <div className="col-md-3">
                        <Form.Group controlId="company_id">
                            <Form.Label className="form-filter-label">Company</Form.Label>
                            <Form.Control
                                as="select"
                                name="company_id"
                                value={filters.company_id}
                                onChange={handleChange}
                            >
                                <option value="">-- All Companies --</option>
                                {companyList.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </div>

                    <div className="col-md-3">
                        <Form.Group controlId="reportDate">
                            <Form.Label className="form-filter-label">Report Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="reportDate"
                                value={filters.reportDate}
                                onChange={handleChange}
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
