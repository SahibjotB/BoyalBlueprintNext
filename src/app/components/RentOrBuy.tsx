import React from 'react';

export default function RentOrBuy() {
  return (
    <section className="relative w-full bg-white py-4 lg:py-12 overflow-hidden">
      {/* Background Dot Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: 'radial-gradient(#d1d5db 1.5px, transparent 1.5px)',
          backgroundSize: '36px 36px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center justify-center mb-20 text-center">
          <h2 className="text-5xl md:text-6xl lg:text-[75px] leading-tight font-serif text-black mb-[-10px] tracking-tight">
            Rent or Buy?
          </h2>
          <h3 className="text-5xl md:text-6xl lg:text-[75px] leading-tight font-sans font-medium text-black tracking-tight">
            Make the decision faster.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Card 1 */}
          <div className="bg-[#f8f9fa] rounded-3xl p-8 lg:p-10 flex flex-col items-center text-center h-full">
            <svg className="mb-8" width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 0C32.598 0 42 9.40202 42 21C42 32.2627 33.1336 41.4536 22 41.9756V42H20V41.9756C8.86639 41.4536 0 32.2627 0 21C0 9.40202 9.40202 0 21 0ZM20 2.02539C9.97142 2.54539 2 10.842 2 21C2 31.158 9.97145 39.4536 20 39.9736V2.02539ZM22 22V39.9736C31.6974 39.4708 39.4718 31.6974 39.9746 22H22ZM22 20H39.9746C39.4718 10.3026 31.6974 2.52822 22 2.02539V20Z" fill="black" />
            </svg>
            <h4 className="text-[22px] font-bold text-black mb-3 text-center">
              Clarity drives action
            </h4>
            <p className="font-serif text-[18px] lg:text-[19px] text-[#3f3f46] leading-tight text-center">
              Understand your options and buying power.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#f8f9fa] rounded-3xl p-8 lg:p-10 flex flex-col items-center text-center h-full">
            <svg className="mb-8" width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 0C32.598 0 42 9.40202 42 21C42 32.598 32.598 42 21 42C9.40202 42 0 32.598 0 21C0 9.40202 9.40202 0 21 0ZM27.8994 30.4619C25.7349 30.8104 23.412 31 21 31C18.5876 31 16.2644 30.8105 14.0996 30.4619C14.4947 32.0411 14.9836 33.4776 15.5479 34.7314C17.1484 38.2881 19.1533 40 21 40C22.8467 40 24.8516 38.2881 26.4521 34.7314C27.0163 33.4776 27.5043 32.041 27.8994 30.4619ZM2.65332 25.9541C4.40717 32.4652 9.53403 37.5914 16.0449 39.3457C15.1512 38.2958 14.3726 36.995 13.7236 35.5527C13 33.9446 12.4001 32.0876 11.9482 30.0508C9.91185 29.5989 8.05507 28.9999 6.44727 28.2764C5.00456 27.6271 3.70336 26.8482 2.65332 25.9541ZM39.3457 25.9541C38.2958 26.848 36.9952 27.6273 35.5527 28.2764C33.9447 29 32.0875 29.5989 30.0508 30.0508C29.5989 32.0875 29 33.9447 28.2764 35.5527C27.6273 36.9952 26.848 38.2958 25.9541 39.3457C32.4653 37.5917 37.5917 32.4653 39.3457 25.9541ZM21 13C18.3867 13 15.9042 13.2318 13.6455 13.6455C13.2318 15.9042 13 18.3867 13 21C13 23.613 13.2319 26.0951 13.6455 28.3535C15.9043 28.7672 18.3866 29 21 29C23.613 29 26.095 28.7671 28.3535 28.3535C28.7671 26.095 29 23.613 29 21C29 18.3866 28.7672 15.9043 28.3535 13.6455C26.0951 13.2319 23.613 13 21 13ZM11.5371 14.0996C9.95825 14.4947 8.52217 14.9837 7.26855 15.5479C3.71186 17.1484 2 19.1533 2 21C2 22.8467 3.71186 24.8516 7.26855 26.4521C8.52211 27.0162 9.95834 27.5043 11.5371 27.8994C11.1886 25.7349 11 23.412 11 21C11 18.5877 11.1885 16.2644 11.5371 14.0996ZM30.4619 14.0996C30.8105 16.2644 31 18.5876 31 21C31 23.412 30.8104 25.7349 30.4619 27.8994C32.041 27.5043 33.4776 27.0163 34.7314 26.4521C38.2881 24.8516 40 22.8467 40 21C40 19.1533 38.2881 17.1484 34.7314 15.5479C33.4776 14.9836 32.0411 14.4947 30.4619 14.0996ZM16.0449 2.65332C9.53422 4.40743 4.40743 9.53422 2.65332 16.0449C3.70328 15.151 5.00478 14.3728 6.44727 13.7236C8.05512 13.0001 9.91177 12.4001 11.9482 11.9482C12.4001 9.91177 13.0001 8.05512 13.7236 6.44727C14.3728 5.00478 15.151 3.70328 16.0449 2.65332ZM25.9541 2.65332C26.8482 3.70336 27.6271 5.00456 28.2764 6.44727C28.9999 8.05507 29.5989 9.91185 30.0508 11.9482C32.0876 12.4001 33.9446 13 35.5527 13.7236C36.995 14.3726 38.2958 15.1512 39.3457 16.0449C37.5914 9.53403 32.4652 4.40717 25.9541 2.65332ZM21 2C19.1533 2 17.1484 3.71186 15.5479 7.26855C14.9837 8.52217 14.4947 9.95825 14.0996 11.5371C16.2644 11.1885 18.5877 11 21 11C23.412 11 25.7349 11.1886 27.8994 11.5371C27.5043 9.95834 27.0162 8.52211 26.4521 7.26855C24.8516 3.71186 22.8467 2 21 2Z" fill="black" />
            </svg>
            <h4 className="text-[22px] font-bold text-black mb-3 text-center">
              Catered Results
            </h4>
            <p className="font-serif text-[18px] lg:text-[19px] text-[#3f3f46] leading-tight text-center">
              Match with properties that fit your criteria.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#f8f9fa] rounded-3xl p-8 lg:p-10 flex flex-col items-center text-center h-full">
            <svg className="mb-8" width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 0C32.598 0 42 9.40202 42 21C42 32.598 32.598 42 21 42C9.40202 42 0 32.598 0 21C0 9.40202 9.40202 0 21 0ZM21 2C10.5066 2 2 10.5066 2 21C2 31.4934 10.5066 40 21 40C31.4934 40 40 31.4934 40 21C40 10.5066 31.4934 2 21 2ZM30 26.4951H28V15.4141L13.707 29.707L12.293 28.293L26.5859 14H15.5049V12H30V26.4951Z" fill="black" />
            </svg>
            <h4 className="text-[22px] font-bold text-black mb-3 text-center">
              Progress over time
            </h4>
            <p className="font-serif text-[18px] lg:text-[19px] text-[#3f3f46] leading-tight text-center">
              Learn when to stop renting and start buying, specific to your home buying journey.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
