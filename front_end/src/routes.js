import Home from './components/Home'
import Vote from './components/Vote'
import validationdevote from './components/validationdevote'
const routes = [
    {path: "/", component: Home, name: "home"},
    {path: "/Vote", component: Vote, name: "Vote"},
    {path: "/validationdevote", component: validationdevote, name: "validationdevote"},
    
];

export default routes;