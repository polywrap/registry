import "./Content.scss";
import Logo from "../../../logo.png";

const Content: React.FC = () => {
  return (
    <div className="container content">
      <div className="row">
        <div>
          <img src={Logo} className="main__logo" />
          <h3 className="title">Polywrap Registry dApp</h3>
        </div>

        <div className="widget-container"></div>
      </div>
    </div>
  );
};
export default Content;
