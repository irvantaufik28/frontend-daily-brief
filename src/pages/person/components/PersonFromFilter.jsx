import { useState } from "react"
import { Button, Form } from "react-bootstrap"
import "../styles/personformfilter.css"
import CardTitleFormFilter from "../../../components/Card/CardTitleFormFilter"

const PersonFromFilter = ({ onFilter }) => {
    const [filters, setFilters] = useState({
        fullName: "",
        position: "",
        status: ""
    })

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onFilter(filters)
    }

    const handleReset = () => {
        const resetFilters = {
            fullName: "",
            position: "",
            status: ""
        }
        setFilters(resetFilters)
        onFilter(resetFilters)
    }



    return (
        <CardTitleFormFilter title={'Peoples table '}>
            <Form onSubmit={handleSubmit} className="mb-3">
                <div className="row align-items-end person-coloum-filter">
                    <div className="col-md-3">
                        <Form.Group controlId="filterFullName">
                            <Form.Label className="form-filter-label">Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                name="fullName"
                                value={filters.fullName}
                                onChange={handleChange}
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
    )
}

export default PersonFromFilter
