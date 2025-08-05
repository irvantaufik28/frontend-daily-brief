import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import CardTitleFormFilter from "../../../components/Card/CardTitleFormFilter";

const CompanyFormFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      name: "",
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  return (
    <CardTitleFormFilter title="Company Table">
      <Form onSubmit={handleSubmit} className="mb-3">
        <div className="row align-items-end global-coloum-filter">
          <div className="col-md-3">
            <Form.Group controlId="filterName">
              <Form.Label className="form-filter-label">Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter company name"
                name="name"
                value={filters.name}
                onChange={handleChange}
              />
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

export default CompanyFormFilter;
