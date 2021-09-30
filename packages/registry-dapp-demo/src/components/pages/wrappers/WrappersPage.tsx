import WrapperInfoComponent from "../../wrappers/wrapper-info/WrapperInfoComponent";
import "./WrappersPage.scss";

const WrappersPage: React.FC = () => {
  return (
    <div className="Content">
      <div className="row">
        <div>
          <h3 className="title">Wrappers</h3>
        </div>

        <div className="widget-container">
          <WrapperInfoComponent></WrapperInfoComponent>
        </div>
      </div>
    </div>
  );
};

export default WrappersPage;
