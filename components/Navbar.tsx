import { UserButton } from "@clerk/nextjs"

const Navbar = () => {
  return (
    <div className='flex justify-between  p-7'>
        <h2 className='text-white text-2xl font-extrabold '>Trust Bank</h2>

        <div className="">
            <UserButton  />
        </div>
    </div>
  )
}

export default Navbar