import axios from 'axios';
import {Navbar} from './Navabar';

export function AdminDashboard(){
    return(
        <div>
            <Navbar page={"DASHBOARD"}/>
        </div>
    )
}