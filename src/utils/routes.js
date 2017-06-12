import Home 		from '../components/home'

import Error 		from '../components/error'

import AddSchema 	from '../components/schema/addschema'
import EditSchema 	from '../components/schema/editschema'

import Elements 	from '../components/elements/elements'
import AddElement 	from '../components/elements/addelement'
import EditElement 	from '../components/elements/editelement'

import AddAttribute 	from '../components/attributes/addattribute'
import EditAttribute 	from '../components/attributes/editattribute'

import Account 	from '../components/account/account'

export default [
	{
		name: 'list',
		path: '/',
		component: Home
	},{
		name: 'create_schema',
		path: '/create/schema',
		component: AddSchema
	},{
		name: 'edit_schema',
		path: '/edit/schema',
		component: EditSchema
	},{
		name: 'create_element',
		path: '/create/element',
		component: AddElement
	},{
		name: 'edit_element',
		path: '/edit/element',
		component: EditElement
	},{
		name: 'create_attribute',
		path: '/create/attribute',
		component: AddAttribute
	},{
		name: 'edit_attribute',
		path: '/edit/attribute',
		component: EditAttribute
	},{
		name: 'error',
		path: '/error/:type',
		component: Error
	},{
		name: 'account',
		path: '/account',
		component: Account
	}
]
