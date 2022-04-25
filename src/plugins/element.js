import Vue from 'vue'
import {
  Button, Form, Row, Col,
  FormItem, Card, Input, Message,
  Main, Container, Header, Aside,
  Breadcrumb, BreadcrumbItem, Menu,
  Submenu, MenuItemGroup, MenuItem, Table, TableColumn, Switch,
  Tooltip, Pagination, Dialog, MessageBox
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(Card)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Tooltip)
Vue.use(Main)
Vue.use(Dialog)
Vue.use(Container)
Vue.use(Header)
Vue.use(MessageBox)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Col)
Vue.use(MenuItemGroup)
Vue.use(Pagination)
Vue.use(Switch)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox
