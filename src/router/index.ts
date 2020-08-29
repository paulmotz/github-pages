import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import LastFM from '../components/LastFM/LastFM.vue';
import Chess from '../components/games/chess/Chess.vue';
import ProvincialCOVID from '../components/visualizations/ProvincialCOVID.vue';
import StateCOVID from '../components/visualizations/StateCOVID.vue';
import NotFound from '../components/NotFound.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
	{
		path      : '/',
		name      : 'Home',
		component : Home,
	},
	{
		path      : '/lastfm',
		name      : 'LastFM',
		component : LastFM,
	},
	{
		path      : '/chess',
		name      : 'Chess',
		component : Chess,
	},
	{
		path      : '/provincial-covid',
		name      : 'ProvincialCOVID',
		component : ProvincialCOVID,
	},
	{
		path      : '/state-covid',
		name      : 'StateCOVID',
		component : StateCOVID,
	},
	{
		path      : '/about',
		name      : 'About',
		component : About,
	},
	{
		path      : '*',
		name      : 'NotFound',
		component : NotFound,
	},
];

const router = new VueRouter({
	mode : 'history',
	base : process.env.BASE_URL,
	routes,
});

export default router;
