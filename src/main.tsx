import '@fontsource/itim/thai-400.css';
import '@fontsource/itim/latin-400.css';
import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import VillageGame from './village/VillageGame';
function GameRoot(){const [lab,setLab]=React.useState(false);return lab?<><App/><button className="legacy-exit" onClick={()=>setLab(false)}>← กลับหมู่บ้าน</button></>:<VillageGame onLab={()=>setLab(true)}/>;}
import './styles.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><GameRoot/></React.StrictMode>);
