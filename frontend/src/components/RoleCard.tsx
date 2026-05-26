type Props = {

 title:string

}

export default function RoleCard({
 title
}:Props){

 return(

 <div
 className="
 border
 rounded-2xl
 p-6
 text-center
 hover:border-purple-500
 hover:shadow-lg
 cursor-pointer
 transition
 "
 >

 <div
 className="
 h-14
 w-14
 bg-purple-100
 rounded-xl
 mx-auto
 "
 />

 <h3
 className="
 mt-4
 font-semibold
 "
 >

 {title}

 </h3>

 </div>

 )

}