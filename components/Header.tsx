import Image from 'next/image'


const Header = () => {
  return (
    <div className='w-full overflow-x-hidden p-4 flex items-center justify-between'>
      <div>
        <Image src="/images/logo.svg" alt='Logo' width={120} height={100} />
      </div>
      <div className='text-neutral-200 font-normal text-[10px]'>
        <span>55 CURRENCIES</span> •
        <span> EOD</span> •
        <span> ECB DATA</span>
      </div>
    </div>
  )
}

export default Header