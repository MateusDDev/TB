const validLogin = {
    email: 'admin@admin.com',
    password: 'secret_admin'
}

const loginWithoutEmail = {
    email: '',
    password: 'secret_admin'
}

const loginWithoutPassword = {
    email: 'admin@admin.com',
    password: ''
}

const invalidLogin = {
    email: 'admin@admin.com',
    password: 'secret'
}

export default {
    validLogin,
    loginWithoutEmail,
    loginWithoutPassword,
    invalidLogin,
}