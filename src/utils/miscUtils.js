import {matchPath} from 'react-router';


function match(path, menuItem, isSubmenu = false) {
    const mask = menuItem.link.mask;
    const isMatch = matchPath(path, {path: mask, exact: true});
    if (isMatch) {
        if (isMatch.path !== '/') {
            return true;
        }
        if (path === '/') {
            return true;
        }
    }
    return false;
}

export function getActiveMenuIndex(menuItems = []) {
    const path = location.hash.replace('#', '');
    const matchedIndex = {index: 0, subMenu: []};
    for (let i = 0; i < menuItems.length; i++) {

        if (match(path, menuItems[i])) {
            matchedIndex.index = i;
            return matchedIndex;
        }
        if (menuItems[i].subItems) {
            const subItems = menuItems[i].subItems;
            for (let j = 0; j < subItems.length; j++) {
                if (match(path, subItems[j])) {
                    matchedIndex.index = `sub${j}`;
                    matchedIndex.subMenu = subItems.map((item, index) => `sub${index}`);
                    return matchedIndex;
                }
            }
        }
    }
    return matchedIndex;
}


function customValidator(validator, rule, value, callback) {
    const prevValue = (this.formValues && this.formValues[rule.field]) || null;
    rule.prevValue = value;
    if (!this.formValues) { //saving form values
        this.formValues = {[rule.field]: value};
    } else {
        this.formValues[rule.field] = value;
    }

    const errorField = this[rule.field]; //if has errors
    if (errorField) {
        if (value && prevValue !== value) {
            delete this[rule.field];
            callback();
            return;
        }
        callback(errorField[0]);
        return;
    }

    if (rule.required && !value) { //rule for required
        callback(rule.message);
        return;
    }
    if (validator) { // if had custom validator
        return validator(rule, value, callback);
    }
    callback();
}

function customFieldDecorator(name, config, getFieldDecorator) {
    const rules = config.rules[0];
    if (!rules.baseValidator) {
        rules.baseValidator = rules.validator;
    }

    if (!rules.baseMessage) {
        rules.baseMessage = rules.message;
    }

    if (this[name]) {
        rules.message = this[name][0];
    } else {
        rules.message = rules.baseMessage;
    }

    const customValidatorWrapped = (rule, value, callback) => customValidator.call(this, rules.baseValidator, rule, value, callback);
    rules.validator = customValidatorWrapped;

    return (input) => {
        return getFieldDecorator(name, config)(input);
    };
}

export function validateResponseError(errorData) {
    const fields = Object.keys(errorData).map(key => key);
    this.setState({errors: errorData}, () => this.props.form.validateFields(fields, {force: true}));
}

export function formValidationDecorator(form) {
    const {getFieldDecorator} = this.props.form;
    const errors = (this.state && this.state.errors) || {};
    Object.keys(errors).map(key => this[key] = errors[key]);
    const customFieldDecoratorBinded = customFieldDecorator.bind(this);
    const customDecorator = (name, config) => customFieldDecoratorBinded(name, config, getFieldDecorator);
    return form.call(this, customDecorator);
}


export function parseServerDate(date){
        var dd = date.getDate();
        var mm = date.getMonth()+1; //January is 0!

        var yyyy = date.getFullYear();
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        } 

        if(yyyy>=2000)
            yyyy = yyyy-2000;
        else if(yyyy>=1900)
            yyyy = yyyy -1900;
        return dd+'/'+mm+'/'+yyyy;
}