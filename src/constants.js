export const API_HOST = "https://api.spacex.land/graphql/";

export const landingsFetchQuery = () => `query LaunchesPast($limit: Int, $offset: Int, $missionName: String){
    launchesPast(limit: $limit, offset: $offset, find: {mission_name: $missionName}) {
      id
      mission_name
      launch_date_local
      launch_site {
        site_name_long
      }
      links {
        article_link
        video_link
      }
      rocket {
        rocket_name
        first_stage {
          cores {
            flight
            core {
              reuse_count
              status
            }
          }
        }
        second_stage {
          payloads {
            payload_type
            payload_mass_kg
            payload_mass_lbs
          }
        }
      }
      ships {
        name
        home_port
        image
      }
    }
  }`