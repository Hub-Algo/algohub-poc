export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative h-96 md:h-screen bg-gradient-to-l from-orange-800 via-orange-900 to-gray-900 flex flex-col items-center justify-between -z-10">
        <div className="flex w-full items-center h-screen">
          <div className="lg:w-1/2 flex flex-col gap-4 py-10 px-10 items-center text-center lg:text-left lg:items-start">
            <h1 className="text-6xl md:text-8xl font-bold text-white">Algohub</h1>
            <h2 className="text-2xl md:text-4xl text-gray-200 animate-pulse w-full md:w-2/3">
              Conceive great ideas with help from the world
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
              <button type="submit" className="btn btn-sm bg-orange-500 text-gray-100 hover:bg-orange-600">
                Create a campaign
              </button>
              <button type="submit" className="btn btn-sm bg-transparent border-gray-100 text-gray-100 hover:bg-orange-600">
                Create a campaign
              </button>
            </div>
          </div>
        </div>
        <div className="bg-gray-900/50 w-full p-6 absolute bottom-0 op">aaaaaa</div>
      </section>
      <section className="bg-gray-950 px-6 py-6">
        <div className="flex flex-col gap-6">
          <h3 className="text-2xl font-bold text-gray-100">Active campaigns 🔥</h3>
          <div className="flex flex-col md:grid items-center gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid 2xl:grid-cols-4 w-full"></div>
        </div>
      </section>
    </div>
  )
}
