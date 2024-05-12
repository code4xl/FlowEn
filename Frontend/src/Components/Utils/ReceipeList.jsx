import React from 'react';
import Card from './Card';

const ReceipeList = ({type, endpoint}) => {
  return (
    <>
        <div className="w-full flex flex-col px-3 items-center justify-center">
            <div className="grid grid-cols-5 gap-4 my-4">
                {/* Check if items is an array and type is '1' before mapping */}
                {Array.isArray(endpoint) && endpoint.map((item, i) => (
                <div key={i} className={`flex-none ${type === '1' && ''} mr-2`}>
                    <Card {...item} key={i} type={type} id={i} />
                </div>
                ))}
            </div>
        </div>
    </>
  )
}

export default ReceipeList