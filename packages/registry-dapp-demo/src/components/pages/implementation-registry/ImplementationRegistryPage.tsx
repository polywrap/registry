import ImplementationRegistryComponent from "../../implementations/widgets/implementations-registry-component/ImplementationRegistryComponent";
import "./ImplementationRegistryPage.scss";

const ImplementationRegistryPage: React.FC = () => {
  return (
    <div className="Content">
      <div className="row">
        <div>
          <h3 className="title">Wrappers</h3>
        </div>

        <div className="widget-container">
          <ImplementationRegistryComponent></ImplementationRegistryComponent>
        </div>
      </div>
    </div>
  );
};

export default ImplementationRegistryPage;
