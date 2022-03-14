const userService = {
  get() {
    if (!localStorage.getItem('user')) localStorage.setItem('user', JSON.stringify({ id: null, tournaments: [] }))
    return JSON.parse(localStorage.getItem('user'))
  },
  set(user) {
    localStorage.setItem('user', JSON.stringify(user))
  }
}

export default userService