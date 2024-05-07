


class EventListener {
    events = {};

    addListener(kind, scope, func) {
        if (!this.events[kind]) {
            this.events[kind] = [];
        }
        let scopeFunctions = null;
        for (let i = 0; i < this.events[kind].length; i++) {
            if (this.events[kind][i].scope === scope) {
                scopeFunctions = this.events[kind][i];
                break;
            }
        }
        if (scopeFunctions == null) {
            scopeFunctions = {scope: scope, functions: []};
            this.events[kind].push(scopeFunctions);
        }
        for (let i = 0; i < scopeFunctions.functions.length; i++) {
            if (scopeFunctions.functions[i] === func) {
                return;
            }
        }
        scopeFunctions.functions.push(func);
    }

    removeListener(kind, scope, func) {
        if (!this.events[kind]) {
            return;
        }
        let scopeFunctions = null;
        for (let i = 0; i < this.events[kind].length; i++) {
            if (this.events[kind][i].scope === scope) {
                scopeFunctions = this.events[kind][i];
                break;
            }
        }
        if (scopeFunctions == null) {
            return;
        }
        for (let i = 0; i < scopeFunctions.functions.length; i++) {
            if (scopeFunctions.functions[i] === func) {
                scopeFunctions.functions.splice(i, 1);
                return;
            }
        }
    }

    fireEvent(kind, event) {
        // TODO:  Should add a deep clone here ...
        if (this.events[kind]) {
            for (let i = 0; i < this.events[kind].length; i++) {
                const objects = this.events[kind][i];
                const functs = objects.functions;
                const scope = objects.scope;
                for (let j = 0; j < functs.length; j++) {
                    const func = functs[j];
                    func.call(scope, event);
                }
            }
        }
    }
}
