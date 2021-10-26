export class SignerConfig {
  verifierPrivateKey = process.env.VERIFIER_PRIVATE_KEY;
  registryAuthorityPrivateKey = process.env.REGISTRY_AUTHORITY_PRIVATE_KEY;
  packageOwnerPrivateKey = process.env.PACKAGE_OWNER_PRIVATE_KEY;
}
