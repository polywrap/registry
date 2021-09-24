import ImplementationsComponent from "./widgets/implementations-component/ImplementationsComponent";
import ImplementationRegistryComponent from "./widgets/implementations-registry-component/ImplementationRegistryComponent";

const ImplementationRegistryComponents: React.FC = () => {
  return (
    <div className="widget-container">
      <div className="registry-container">
        <ImplementationRegistryComponent />
      </div>

      <div className="implementations-container">
        <ImplementationsComponent />
      </div>
    </div>
  );
};

export default ImplementationRegistryComponents;
