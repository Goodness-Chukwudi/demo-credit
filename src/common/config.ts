const Environments = Object.freeze({
  PROD: "production",
  STAGING: "staging",
  DEV: "development",
  UAT: "user-acceptance-test"
});

const JoiValidatorOptions = {
  errors: {
    wrap: {
      label: ""
    }
  },
  stripUnknown: true,
  abortEarly: false,
  allowUnknown: false
};

export {
  Environments,
  JoiValidatorOptions
}