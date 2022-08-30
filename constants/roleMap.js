exports.privilege = {
    admin: {
        list: {
            route: 'admin',
            action: 'list'
        },
        detail: {
            route: 'admin',
            action: 'detail'
        },
        create: {
            route: 'admin',
            action: 'create'
        },
        update: {
            route: 'admin',
            action: 'update'
        },
        delete: {
            route: 'admin',
            action: 'delete'
        }
    },
    user: {
        list: {
            route: 'user',
            action: 'list'
        },
        detail: {
            route: 'user',
            action: 'detail'
        },
        create: {
            route: 'user',
            action: 'create'
        },
        update: {
            route: 'user',
            action: 'update'
        },
        delete: {
            route: 'user',
            action: 'delete'
        }
    },
    role: {
        list: {
            route: 'role',
            action: 'list'
        },
        detail: {
            route: 'role',
            action: 'detail'
        },
        create: {
            route: 'role',
            action: 'create'
        },
        update: {
            route: 'role',
            action: 'update'
        },
        delete: {
            route: 'role',
            action: 'delete'
        }
    },
    category: {
        list: {
            route: 'category',
            action: 'list'
        },
        detail: {
            route: 'category',
            action: 'detail'
        },
        create: {
            route: 'category',
            action: 'create'
        },
        update: {
            route: 'category',
            action: 'update'
        },
        delete: {
            route: 'category',
            action: 'delete'
        },
        approve: {
            route: 'category',
            action: 'approve'
        }
    },
    brand: {
        list: {
            route: 'brand',
            action: 'list'
        },
        detail: {
            route: 'brand',
            action: 'detail'
        },
        create: {
            route: 'brand',
            action: 'create'
        },
        update: {
            route: 'brand',
            action: 'update'
        },
        delete: {
            route: 'brand',
            action: 'delete'
        },
        approve: {
            route: 'brand',
            action: 'approve'
        }
    },
    store: {
        list: {
            route: 'store',
            action: 'list'
        },
        detail: {
            route: 'store',
            action: 'detail'
        },
        create: {
            route: 'store',
            action: 'create'
        },
        update: {
            route: 'store',
            action: 'update'
        },
        delete: {
            route: 'store',
            action: 'delete'
        },
        approve: {
            route: 'store',
            action: 'approve'
        }
    },
    product: {
        list: {
            route: 'product',
            action: 'list'
        },
        detail: {
            route: 'product',
            action: 'detail'
        },
        create: {
            route: 'product',
            action: 'create'
        },
        update: {
            route: 'product',
            action: 'update'
        },
        delete: {
            route: 'product',
            action: 'delete'
        },
        approve: {
            route: 'product',
            action: 'approve'
        }
    },
    promotion: {
        list: {
            route: 'promotion',
            action: 'list'
        },
        detail: {
            route: 'promotion',
            action: 'detail'
        },
        create: {
            route: 'promotion',
            action: 'create'
        },
        update: {
            route: 'promotion',
            action: 'update'
        },
        delete: {
            route: 'promotion',
            action: 'delete'
        },
        approve: {
            route: 'promotion',
            action: 'approve'
        }
    },
    transaction: {
        list: {
            route: 'transaction',
            action: 'list'
        },
        detail: {
            route: 'transaction',
            action: 'detail'
        },
        create: {
            route: 'transaction',
            action: 'create'
        },
        update: {
            route: 'transaction',
            action: 'update'
        },
        delete: {
            route: 'transaction',
            action: 'delete'
        },
        approve: {
            route: 'transaction',
            action: 'approve'
        }
    },
    payment: {
        list: {
            route: 'payment',
            action: 'list'
        },
        detail: {
            route: 'payment',
            action: 'detail'
        },
        create: {
            route: 'payment',
            action: 'create'
        },
        update: {
            route: 'payment',
            action: 'update'
        },
        delete: {
            route: 'payment',
            action: 'delete'
        },
        approve: {
            route: 'payment',
            action: 'approve'
        }
    },
    drawer: {
        list: {
            route: 'drawer',
            action: 'list'
        },
        detail: {
            route: 'drawer',
            action: 'detail'
        },
        create: {
            route: 'drawer',
            action: 'create'
        },
        update: {
            route: 'drawer',
            action: 'update'
        },
        delete: {
            route: 'drawer',
            action: 'delete'
        },
        approve: {
            route: 'drawer',
            action: 'approve'
        }
    },
    preset: {
        list: {
            route: 'preset',
            action: 'list'
        },
        detail: {
            route: 'preset',
            action: 'detail'
        },
        create: {
            route: 'preset',
            action: 'create'
        },
        update: {
            route: 'preset',
            action: 'update'
        },
        delete: {
            route: 'preset',
            action: 'delete'
        },
        approve: {
            route: 'preset',
            action: 'approve'
        }
    },
}

let role
const roles = Object.keys(this.privilege)
roles.forEach(p => {
    role = {
        ...role,
        [p]: {}
    }
    Object.keys(this.privilege[p]).forEach(k => {
        role[p][k] = false
    })
})

exports.preRole = role

