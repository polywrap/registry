import {
  calculateOrganizationId,
  OrganizationInfo,
  PackageInfo,
} from "@polywrap/registry-js";
import { BytesLike } from "ethers";
import { useState } from "react";
import { toPrettyHex } from "../../../helpers/toPrettyHex";
import { useToastIfError } from "../../../helpers/useToastIfError";
import { usePolywrapRegistry } from "../../../hooks/usePolywrapRegistry";
import "./WrappersPage.scss";

const WrappersPage: React.FC = () => {
  const toastIfError = useToastIfError();
  const registry = usePolywrapRegistry();
  const [organizationInfo, setOrganizationInfo] = useState<{
    organization: OrganizationInfo;
    organizationId: BytesLike;
    packages: Array<
      PackageInfo & {
        packageId: BytesLike;
      }
    >;
  }>();

  const [inputDomainRegistry, setInputDomainRegistry] = useState<"ens">("ens");
  const [inputDomainName, setInputDomainName] = useState<string>(
    "thisisateest.eth"
  );
  const [inputAddress, setInputAddress] = useState("");
  const [registerPackageName, setRegisterPackageName] = useState("");
  const [registerPackageOwner, setRegisterPackageOwner] = useState("");
  const [registerPackageController, setRegisterPackageController] = useState(
    ""
  );

  const [domainOwner, setDomainOwner] = useState("");
  const [domainRegistry, setDomainRegistry] = useState<"ens">("ens");
  const [domainName, setDomainName] = useState("");
  const loadDomainInfo = async () => {
    if (!inputDomainName || !inputDomainRegistry) {
      throw "Domain registry and domain name are required";
    }

    const organizationId = calculateOrganizationId(
      inputDomainRegistry,
      inputDomainName
    );
    const domainOwner = await registry.domainOwner(
      inputDomainRegistry,
      inputDomainName
    );

    setDomainRegistry(inputDomainRegistry);
    setDomainName(inputDomainName);
    setDomainOwner(domainOwner);

    await loadOrganizationInfo(organizationId);
  };

  const loadOrganizationInfo = async (organizationId: BytesLike) => {
    const organization = await registry.organization(organizationId);

    const packageIds = await registry.packageIds(organizationId, 0, 10);
    const packages = await Promise.all(
      packageIds.map(async (packageId) => {
        const packageInfo = await registry.package(packageId);

        return {
          ...packageInfo,
          packageId,
        };
      })
    );

    setOrganizationInfo({
      organization,
      organizationId,
      packages: packages,
    });
  };

  return (
    <div className="Content">
      <div className="row">
        <div>
          <h3 className="title">Wrappers</h3>
        </div>

        <div className="widget-container">
          <div className="">
            <select
              className="domain-registry"
              value={inputDomainRegistry}
              onChange={async (e) => {
                if (e.target.value === "ens") {
                  setInputDomainRegistry(e.target.value);
                }
              }}
            >
              <option value="ens">ENS</option>
            </select>
            <input
              type="text"
              value={inputDomainName}
              placeholder="Domain..."
              onChange={async (e) => {
                setInputDomainName(e.target.value);
              }}
            />

            <button className="find-btn" onClick={() => loadDomainInfo()}>
              Find
            </button>
          </div>

          {organizationInfo ? (
            <>
              <table className="info-table widget">
                <tbody>
                  <tr>
                    <td colSpan={2}>Domain</td>
                  </tr>
                  <tr>
                    <td>Registry:</td>
                    <td>{domainRegistry}</td>
                  </tr>
                  <tr>
                    <td>Domain:</td>
                    <td>{domainName}</td>
                  </tr>
                  <tr>
                    <td>Owner:</td>
                    <td>{toPrettyHex(domainOwner)}</td>
                  </tr>
                </tbody>
              </table>

              <table className="info-table widget">
                <tbody>
                  <tr>
                    <td colSpan={2}>Organization</td>
                  </tr>
                  <tr>
                    <td>Id:</td>
                    <td>
                      {toPrettyHex(organizationInfo.organizationId.toString())}
                    </td>
                  </tr>
                  <tr>
                    <td>Claimed:</td>
                    <td>
                      {organizationInfo.organization.exists ? "Yes" : "No"}
                    </td>
                  </tr>
                  <tr>
                    <td>Owner:</td>
                    <td>{toPrettyHex(organizationInfo.organization.owner)}</td>
                  </tr>
                  <tr>
                    <td>Controller:</td>
                    <td>
                      {toPrettyHex(organizationInfo.organization.controller)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div>
                <div>
                  <input
                    type="text"
                    value={inputAddress}
                    placeholder="Address..."
                    onChange={async (e) => {
                      setInputAddress(e.target.value);
                    }}
                  />
                </div>

                <div>
                  <button
                    className="find-btn"
                    onClick={async () =>
                      await toastIfError(
                        registry.claimOrganizationOwnership(
                          domainRegistry,
                          domainName,
                          inputAddress
                        )
                      )
                    }
                  >
                    Claim ownership
                  </button>
                </div>

                <div>
                  <button
                    className="find-btn"
                    onClick={async () =>
                      await toastIfError(
                        registry.transferOrganizationOwnership(
                          organizationInfo.organizationId,
                          inputAddress
                        )
                      )
                    }
                  >
                    Transfer ownership
                  </button>
                </div>

                <div>
                  <button
                    className="find-btn"
                    onClick={async () =>
                      await toastIfError(
                        registry.setOrganizationController(
                          organizationInfo.organizationId,
                          inputAddress
                        )
                      )
                    }
                  >
                    Set controller
                  </button>
                </div>

                <div>
                  <button
                    className="find-btn"
                    onClick={async () =>
                      await toastIfError(
                        registry.transferOrganizationControl(
                          organizationInfo.organizationId,
                          inputAddress
                        )
                      )
                    }
                  >
                    Transfer control
                  </button>
                </div>

                <div>
                  <input
                    type="text"
                    value={registerPackageName}
                    placeholder="Name..."
                    onChange={async (e) => {
                      setRegisterPackageName(e.target.value);
                    }}
                  />

                  <input
                    type="text"
                    value={registerPackageOwner}
                    placeholder="Owner..."
                    onChange={async (e) => {
                      setRegisterPackageOwner(e.target.value);
                    }}
                  />

                  <input
                    type="text"
                    value={registerPackageController}
                    placeholder="Controller..."
                    onChange={async (e) => {
                      setRegisterPackageController(e.target.value);
                    }}
                  />

                  <button
                    className="find-btn"
                    onClick={async () => {
                      const tx = await toastIfError(
                        registry.registerPackage(
                          organizationInfo.organizationId,
                          registerPackageName,
                          registerPackageOwner,
                          registerPackageController
                        )
                      );

                      if (!tx) {
                        return;
                      }

                      await tx.wait();

                      await loadOrganizationInfo(
                        organizationInfo.organizationId
                      );
                    }}
                  >
                    Register package
                  </button>
                </div>

                <div>
                  {organizationInfo.packages.map((packageInfo, i) => (
                    <div key={i}>
                      <table className="info-table widget">
                        <tbody>
                          <tr>
                            <td colSpan={2}>Package</td>
                          </tr>
                          <tr>
                            <td>Id:</td>
                            <td>
                              {toPrettyHex(packageInfo.packageId.toString())}
                            </td>
                          </tr>
                          <tr>
                            <td>Owner:</td>
                            <td>{toPrettyHex(packageInfo.owner)}</td>
                          </tr>
                          <tr>
                            <td>Controller:</td>
                            <td>{toPrettyHex(packageInfo.owner)}</td>
                          </tr>
                          <tr>
                            <td>Organization Id:</td>
                            <td>
                              {toPrettyHex(
                                packageInfo.organizationId.toString()
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default WrappersPage;
