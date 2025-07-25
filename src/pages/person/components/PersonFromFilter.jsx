import { useState } from "react"
import { Button, Form } from "react-bootstrap"
import "../styles/personformfilter.css"

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
        <div>

            <div className="row">
                <div className="col-12">
                    <div className="card my-4 card-from-filter">
                        <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                            <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
                                <h6 className="text-white text-capitalize ps-3">Peoples table</h6>
                            </div>
                        </div>
                        <div className="card-body px-0 pb-2 ">
                            <Form onSubmit={handleSubmit} className="mb-3">
                                <div className="row align-items-end person-coloum-filter">
                                    <div className="col-md-3">
                                        <Form.Group controlId="filterFullName">
                                            <Form.Label>Name</Form.Label>
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
                                            <Form.Label>Position</Form.Label>
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
                                            <Form.Label>Status</Form.Label>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PersonFromFilter
