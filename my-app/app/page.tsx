import ExploreBtn from "@/components/ExploreBtn"
import EventCards from "@/components/EventCards"
import events from "@/lib/constraint"

const Home = () => {
  return (
    <section>
        <h1 className="text-center">The Hub for Every Dev <br />Event you can't Miss</h1>
        <p className="text-center">Hackathon, Meetup, and Conferences, All In One Place</p>

        <ExploreBtn />
        <div className="mt-20 space-y-7">
          <h3>Featured Events</h3>

          <ul className="events">
            {events.map((event) => (
              <li key={event.title}>
                <EventCards {...event}/>
              </li>
            ))}
          </ul>
        </div>
    </section>

   
   

  )
}

export default Home