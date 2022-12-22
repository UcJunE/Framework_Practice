// import in caolan forms
const forms = require("forms");
const { trigger } = require("../bookshelf");
// create some shortcuts
const fields = forms.fields;
const validators = forms.validators;
//widget must be declare - mainly for dropdown
const widgets = forms.widgets;

var bootstrapField = function (name, object) {
  if (!Array.isArray(object.widget.classes)) {
    object.widget.classes = [];
  }

  if (object.widget.classes.indexOf("form-control") === -1) {
    object.widget.classes.push("form-control");
  }

  var validationclass = object.value && !object.error ? "is-valid" : "";
  validationclass = object.error ? "is-invalid" : validationclass;
  if (validationclass) {
    object.widget.classes.push(validationclass);
  }

  var label = object.labelHTML(name);
  var error = object.error
    ? '<div class="invalid-feedback">' + object.error + "</div>"
    : "";

  var widget = object.widget.toHTML(name, object);
  return '<div class="form-group">' + label + widget + error + "</div>";
};

// top part meant for import in the forms module and implementation on bootstrapfield helper + format form

//createProductForm function
const createPosterForm = (categories, tags) => {
  return forms.create({
    title: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    image_url: fields.string({
      widget: widgets.hidden(),
    }),
    cost: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validator: [validators.integer()],
    }),
    description: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    date: fields.date({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    stock: fields.number({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validator: [validators.integer()],
    }),
    height: fields.number({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validator: [validators.integer()],
    }),
    width: fields.number({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validator: [validators.integer()],
    }),
    category_id: fields.string({
      //what is label ? change the name of the category id to category
      label: "Category",
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      widget: widgets.select(),
      choices: categories,
    }),
    tags: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      widget: widgets.multipleSelect(),
      choices: tags,
    }),
  });
};

const createRegistrationForm = () => {
  return forms.create({
    username: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    email: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    password: fields.password({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    // important - why password got 2 field , when register - extra 1 more input box to confirm the password
    confirm_password: fields.password({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validators: [validators.matchField("password")],
    }),
  });
};

//create login form
const createLoginForm = () => {
  return forms.create({
    email: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    password: fields.password({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
  });
};

module.exports = {
  createPosterForm,
  bootstrapField,
  createRegistrationForm,
  createLoginForm,
};
