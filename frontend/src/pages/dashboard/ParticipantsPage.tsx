import { useEffect, useState } from "react";
import { Participant } from "../../types";

export default function ParticipantsPage() {

const [participants,setParticipants]=
useState<Participant[]>([]);

useEffect(()=>{

// future API fetch yaha aayega

setParticipants([]);

},[]);

return(

<div className="
p-6
">

<h1 className="
text-2xl
font-bold
mb-6
">

Participants

</h1>

<div className="
bg-white
rounded-xl
shadow-sm
border
border-gray-200
overflow-hidden
">

<table className="
w-full
">

<thead className="
bg-gray-50
">

<tr>

<th className="
px-4
py-3
text-left
">

Name

</th>

<th className="
px-4
py-3
text-left
">

Email

</th>

<th className="
px-4
py-3
text-left
">

Institution

</th>

<th className="
px-4
py-3
text-left
">

Skills

</th>

<th className="
px-4
py-3
text-left
">

Experience

</th>

</tr>

</thead>

<tbody>

{

participants.length===0

?

(

<tr>

<td

colSpan={5}

className="
text-center
py-8
text-gray-500
"

>

No participants found

</td>

</tr>

)

:

(

participants.map(

(participant)=>(

<tr

key={participant.id}

className="
border-t
"

>

<td className="
px-4
py-3
">

{participant.name}

</td>

<td className="
px-4
py-3
">

{participant.email}

</td>

<td className="
px-4
py-3
">

{

participant.institution

??

"-"

}

</td>

<td className="
px-4
py-3
">

{

participant.skills?.join(", ")

??

"-"

}

</td>

<td className="
px-4
py-3
">

{

participant.experience

??

"-"

}

</td>

</tr>

)

)

)

}

</tbody>

</table>

</div>

</div>

)

}