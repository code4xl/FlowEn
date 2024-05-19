import React, { useEffect, useState } from 'react'
import { fetchWfData, fetchWfDetails } from '../../Services/Repository/WorkFlowRepo';
import Select from 'react-select';

const InitiateWorkflow = () => {
    const [wfList, setWfList] = useState();
    const[WFValue, setWFValue] = useState(null);
    const [wfDetails, setWfDetails] = useState();

    const handleWfDataChange = (e) => {
        const values = e.value;
        setWFValue(values);
    }

    useEffect(()=>{
        const fetchWfListFunc = async () =>{
            try{
                const wfList = await fetchWfData();
                setWfList(wfList);
            }
            catch(err){
                console.error("Error while fetching the nodes data at frontend side : ", err);
            }
        }

        fetchWfListFunc();
    },[]);
    const onSearchClick = async () => {
        console.log("Selected workflow id is : " + WFValue);
        const WFdata = await fetchWfDetails(WFValue);
        setWfDetails(WFdata);
        console.log("Workflow data received is : ", WFdata);
    }
  return (
    <div className="w-screen flex-col p-3">
        <div className="flex flex-row items-center justify-start w-full gap-3">
            <div className="flex w-1/6">
                <Select className="w-full" options={wfList} placeholder="Select WorkFlow"  defaultValue={WFValue} onChange={handleWfDataChange}/>
            </div>
            <button onClick={onSearchClick}>Search</button>
        </div>
        <br />
        <h2>Workflow Created is as follows :</h2>
        <div className="flex flex-row gap-4">
            {Array.isArray(wfDetails) && wfDetails.map((items, id)=>(
                <div key={id}>
                    <p>{items.title} &rarr;</p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default InitiateWorkflow