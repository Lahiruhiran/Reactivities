import React, { useEffect, useState } from 'react';
import { Container} from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from "./NavBar";
import ActivityDashboard  from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponents from '../layout/LoadingComponets'

function App() {
const [activity, setActivity] = useState<Activity[]>([]);
const [selectedActivities,setSelectedActivities] = useState<Activity | undefined>(undefined)
const [editMode, setEditMode] = useState(false);
const [loading, setLoading] = useState(true)
const [submiting, setSubmiting] = useState(false)

useEffect(() => {
 agent.Activities.list().then(response =>{
   let activites : Activity[] =[];
   response.forEach(activity =>{
     activity.date = activity.date.split('T')[0];
     activites.push(activity);
   })
    setActivity(activites);
    setLoading(false);
  })
}, [])

function handleSelectedActivity(id:String) {
  setSelectedActivities(activity.find(x=> x.id === id))
  
}
function handlecancelledActivity() {
  setSelectedActivities(undefined)
  
}
function handleFormOpen(id?:string) {
  id? handleSelectedActivity(id) :handlecancelledActivity();
  setEditMode(true);
}
function handleFormClose(){
setEditMode(false);
}
function handleDeleteActivity(id:string)
{
  setSubmiting(true);
  agent.Activities.delete(id).then(()=>{
    setActivity([...activity.filter(x => x.id !== id)]);
    setSubmiting(false)
  })

 

}

function handelCreateOrEditActivity(activities:Activity) {
  setSubmiting(true);
  if(activities.id){
    agent.Activities.update(activities).then(()=>{
      setActivity([...activity.filter(x => x.id !== activities.id),activities])
      setSelectedActivities(activities)
      setEditMode(false)
      setSubmiting(false)
    })
  }else{
    activities.id =uuid();
    agent.Activities.create(activities).then(()=>{
      setActivity([...activity,activities])
      setSelectedActivities(activities)
      setEditMode(false)
      setSubmiting(false)
    })
  }
}

if (loading) return <LoadingComponents  content="Loading App"/>

  return (
    <>
     <NavBar openForm={handleFormOpen}/>
     <Container style={{marginTop:'7em'}}>
    <ActivityDashboard activities={activity}
        selectedActivity ={selectedActivities}
        selectActivity ={handleSelectedActivity}
        cancelSelectActivity ={handlecancelledActivity}
        editMode ={editMode}
        openForm ={handleFormOpen}
        closeForm ={handleFormClose}
        createOrEdit ={handelCreateOrEditActivity}
        deleteActivity ={handleDeleteActivity}
        submitting={submiting}
    />
     </Container> 
    </>
  );
}

export default App;
