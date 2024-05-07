
class Toolbar {
    constructor(toolbar) {
        if (typeof toolbar == "string") {
            toolbar = document.getElementById(toolbar);
        }
        this.toolbar = toolbar;
        toolbar.innerHTML = "";
        toolbar.classList.add("toolbar");
    }

    element(tag, attrs, ...children) {
        const element = document.createElement(tag);
        if (attrs) {
            for (const name in attrs) {
                element.setAttribute(name, attrs[name]);
            }
        }
        if (children) {
            element.append(...children);
        }
        return element;
    }

    input(type, value, attrs) {
        if (!attrs) attrs = {};
        attrs["type"] = type;
        attrs["value"] = value;
        return this.element("input", attrs);
    }

    add(element) {
        return this.toolbar.appendChild(element);
    }

    addBreak() {
        return this.add(this.element("span", {class: "break"}, " "));
    }

    addLabel(...content) {
        return this.add(this.element("span", {class: "label"}, ...content));
    }

    addInput(type, value, attrs) {
        return this.add(this.input(type, value, attrs));
    }

    addButton(text, attrs) {
        return this.add(this.element("button", attrs, text));
    }

    addCheckbox(label, attrs) {
        if (!attrs) attrs = {};
        if (!attrs.id) attrs.id = `${this.toolbar.id}-${this.toolbar.childElementCount}`;
        const checkbox = this.addInput("checkbox", label, attrs);
        this.add(this.element("label", {for: attrs.id}, label));
        return checkbox;
    }

    addRadio(label, group, attrs) {
        if (!attrs) attrs = {};
        if (!attrs.id) attrs.id = `${this.toolbar.id}-${this.toolbar.childElementCount}`;
        attrs.name = group;
        const radio = this.addInput("radio", label, attrs);
        this.add(this.element("label", {for: attrs.id}, label));
        return radio;
    }

    addRadioButtons(labels, group, attrs) {
        const radioList = [];
        for (const lbl of labels) {
            radioList.push(this.addRadio(lbl, group, attrs));
        }
        return radioList;
    }

    addSelect(values, labels, attrs) {
        const options = [];
        for (let i = 0; i < values.length; i++) {
            options.push(
                this.element("option", {value: values[i]}, labels ? labels[i] : values[i]),
            );
        }
        return this.add(this.element("select", attrs, ...options));
    }
}
