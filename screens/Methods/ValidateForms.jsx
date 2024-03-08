function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).replace("_", " ");
}
export const BlankValidation = (
  data,
  action,
  errors_arr,
  setErrors,
  toast,
  passwordStrength
) => {
  var errorobj = {};
  var proceed = true;
  Object.keys(data).map(function (key) {
    // var string = capitalizeFirstLetter(key);
    if (data[key] == "") {
      errorobj[key] = `Required`;
      proceed = false;
    }
    if (passwordStrength < 2) {
      errorobj["password"] = "Please provide a stronger Password";
      proceed = false;
    }
  });
  if (proceed) action();
  else {
    setErrors({ ...errors_arr, ...errorobj });
    return false;
  }
};
export const alphaBetsOnly = (e, setState, prevState, setErrors, errors) => {
  const { name, value, id } = e.target;
  const result = value.replace(/[^a-z ]/gi, "");
  setState({ ...prevState, [name]: result });
  if (value.length == 0) {
    setErrors({ ...errors, [name]: `Required` });
  } else {
    setErrors({ ...errors, [name]: "" });
  }
};
// export const emailOnly = (e, setState, prevState, setErrors, errors) => {
//   const { name, value } = e.target;
//   setState({ ...prevState, [name]: value });
//   const regex =
//     /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
//   if (regex.test(value) === false) {
//     setErrors({ ...errors, [name]: "Must be a valid E-Email" });
//   } else {
//     setErrors({ ...errors, [name]: "" });
//   }
// };
export const emailOnly = (value, setErrors, errors, name) => {
  // setState({ ...prevState, [name]: value });
  const regex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  if (value.length == 0) setErrors({ ...errors, [name]: "Cannot be empty" });
  else {
    if (regex.test(value) === false) {
      setErrors({ ...errors, [name]: "Must be a valid E-Email" });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  }
};
