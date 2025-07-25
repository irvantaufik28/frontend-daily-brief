import './style/cardtitleformfilter.css'
const CardTitleFormFilter = ({ title, children }) => {
    return (
        <div className="row">
            <div className="col-12">
                <div className="card my-4 card-from-filter">
                    <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                        <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
                            <h6 className="text-white text-capitalize ps-3">{title}</h6>
                        </div>
                    </div>
                    <div className="card-body px-0 pb-2 ">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardTitleFormFilter;
