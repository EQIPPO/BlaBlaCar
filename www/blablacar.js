function request(url, method="GET", data={}, headers={}) {
    return new Promise((resolve, reject) => {
        headers["Content-Type"] = "application/json";
        fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(data)
        }).then(response => {
            return response.json();
        }).then(data => {
            resolve(data);
        }).catch(error => {
            reject(error);
        });
    });
}

function post(url, data={}, headers={}) {
    return request(url, "POST", data, headers);
}

function get(url, data={}, headers={}) {
    return request(url, "GET", data, headers);
}

function parseForm(form) {
    let data = {};
    for (let i = 0; i < form.length; i++) {
        if (form[i].type !== "submit")
            data[form[i].name] = form[i].value;
    }
    return data;
}

const blablacar = {
    login: async (login, password) => {
        const result = await post("/api/auth/login", { login: login, password: password });
        if (result.status === 200) {
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));
            return result.user;
        }
        else {
            throw result.message;
        }
    },
    register: async (login, password, name) => {
        const result = await post("/api/auth/register", { login: login, password: password, name: name });
        if (result.status === 200) {
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));
            return result.user;
        }
        else {
            throw result.message;
        }
    },
    isLoggedIn: () => {
        return localStorage.getItem("token") !== null;
    },
    getToken: () => {
        return localStorage.getItem("token");
    },
    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem("user"));
    },
    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },
}