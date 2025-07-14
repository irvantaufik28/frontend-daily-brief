import { useNavigate } from "react-router-dom";
import "./PageNotFound.css"; 

const PageNotFound = () => {
  const navigate = useNavigate();

  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <div className="error-page__body">
      <div className="error-page__container">
        <div className="error-page__number">404</div>
        <p className="error-page__text lead">Page Not Found</p>
        <p className="error-page__paragraph">It looks like you found a glitch in the matrix...</p>
        <a href="#" onClick={handleBack} className="error-page__link">
          ← Go back to the previous page
        </a>
      </div>
    </div>
  );
};

export default PageNotFound;
