import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";

import "../styles/personformfilter.css";
import CardTitleFormFilter from "../../../components/Card/CardTitleFormFilter";
import config from "../../../config";

const PersonFromFilter = ({ onFilter }) => {
    const [filters, setFilters] = useState({
        fullName: "",
        position: "",
        status: ""
    });

    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
    
    
        useEffect(() => {
        const fetchPersons = async () => {
            const apiUrl = config.apiUrl + "/person-list";
            try {
                const res = await axios.get(apiUrl, { headers: { Authorization: token } });
                const mappedOptions = res.data.data.map(person => ({
                    value: person.id,
                    label: person.fullName
                }));
                setOptions(mappedOptions);
            } catch (error) {
                console.error("Failed to fetch person list", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPersons();
    }, []);

    const handleSelectChange = (selected) => {
        setFilters({
            ...filters,
            fullName: selected ? selected.label : ""
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter(filters);
    };

    const handleReset = () => {
        const resetFilters = {
            fullName: "",
            position: "",
            status: ""
        };
        setFilters(resetFilters);
        onFilter(resetFilters);
    };

    return (
        <CardTitleFormFilter title={"Peoples table "}>
            <Form onSubmit={handleSubmit} className="mb-3">
                <div className="row align-items-end person-coloum-filter">
                    <div className="col-md-3">
                        <Form.Group controlId="filterFullName">
                            <Form.Label className="form-filter-label">Name</Form.Label>
                            <Select
                                options={options}
                                isLoading={isLoading}
                                isClearable
                                placeholder="Select or search name"
                                onChange={handleSelectChange}
                                value={options.find(o => o.label === filters.fullName) || null}
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                        </Form.Group>
                    </div>
                    <div className="col-md-3">
                        <Form.Group controlId="filterPosition">
                            <Form.Label className="form-filter-label">Position</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter position"
                                name="position"
                                value={filters.position}
                                onChange={handleChange}
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
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                                <option value="TERMINATED">TERMINATED</option>
                            </Form.Control>
                        </Form.Group>
                    </div>
                    <div className="col-md-3">
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

export default PersonFromFilter;
