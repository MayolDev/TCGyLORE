import ChronicleController from './ChronicleController'
import DashboardController from './DashboardController'
import Admin from './Admin'
import Settings from './Settings'
const Controllers = {
    ChronicleController: Object.assign(ChronicleController, ChronicleController),
DashboardController: Object.assign(DashboardController, DashboardController),
Admin: Object.assign(Admin, Admin),
Settings: Object.assign(Settings, Settings),
}

export default Controllers