import { useI18n } from "@ui/i18n";
import { ImageSourcePropType } from "react-native";

export interface SportType {
  id: number;
	title: string;
	icon: ImageSourcePropType;
}


export const getSports = (): SportType[] => {

  const { format } = useI18n();
  
  return ([
    {
      id: 0,
      title: format('sport.airSports'),
      icon: require('@assets/images/sports/airSports.png')
    },
    {
      id: 1,
      title: format('sport.americanFootball'),
      icon: require('@assets/images/sports/americanFootball.png')
    },
    {
      id: 2,
      title: format('sport.badminton'),
      icon: require('@assets/images/sports/badminton.png')
    },
    {
      id: 3,
      title: format('sport.baseball'),
      icon: require('@assets/images/sports/baseball.png')
    },
    {
      id: 4,
      title: format('sport.basketball'),
      icon: require('@assets/images/sports/basketball.png')
    },
    {
      id: 5,
      title: format('sport.bike'),
      icon: require('@assets/images/sports/bike.png')
    },
    {
      id: 6,
      title: format('sport.boxing'),
      icon: require('@assets/images/sports/boxing.png')
    },
    {
      id: 7,
      title: format('sport.calisthenics'),
      icon: require('@assets/images/sports/calisthenics.png')
    },
    {
      id: 8,
      title: format('sport.climbing'),
      icon: require('@assets/images/sports/climbing.png')
    },
    {
      id: 9,
      title: format('sport.cricket'),
      icon: require('@assets/images/sports/cricket.png')
    },
    {
      id: 10,
      title: format('sport.crossCountrySkiing'),
      icon: require('@assets/images/sports/crossCountrySkiing.png')
    },
    {
      id: 11,
      title: format('sport.danse'),
      icon: require('@assets/images/sports/danse.png')
    },
    {
      id: 12,
      title: format('sport.diving'),
      icon: require('@assets/images/sports/diving.png')
    },
    {
      id: 13,
      title: format('sport.elliptical'),
      icon: require('@assets/images/sports/elliptical.png')
    },
    {
      id: 14,
      title: format('sport.fencing'),
      icon: require('@assets/images/sports/fencing.png')
    },
    {
      id: 15,
      title: format('sport.fieldHockey'),
      icon: require('@assets/images/sports/fieldHockey.png')
    },
    {
      id: 16,
      title: format('sport.fishing'),
      icon: require('@assets/images/sports/fishing.png')
    },
    {
      id: 17,
      title: format('sport.gaming'),
      icon: require('@assets/images/sports/gaming.png')
    },
    {
      id: 18,
      title: format('sport.golf'),
      icon: require('@assets/images/sports/golf.png')
    },
    {
      id: 19,
      title: format('sport.gymnastics'),
      icon: require('@assets/images/sports/gymnastics.png')
    },
    {
      id: 20,
      title: format('sport.handball'),
      icon: require('@assets/images/sports/handball.png')
    },
    {
      id: 21,
      title: format('sport.hiit'),
      icon: require('@assets/images/sports/hiit.png')
    },
    {
      id: 22,
      title: format('sport.hiking'),
      icon: require('@assets/images/sports/hiking.png')
    },
    {
      id: 23,
      title: format('sport.horseRiding'),
      icon: require('@assets/images/sports/horseRiding.png')
    },
    {
      id: 24,
      title: format('sport.iceHockey'),
      icon: require('@assets/images/sports/iceHockey.png')
    },
    {
      id: 25,
      title: format('sport.jumpingRope'),
      icon: require('@assets/images/sports/jumpingRope.png')
    },
    {
      id: 26,
      title: format('sport.kayaking'),
      icon: require('@assets/images/sports/kayaking.png')
    },
    {
      id: 27,
      title: format('sport.lacrosse'),
      icon: require('@assets/images/sports/lacrosse.png')
    },
    {
      id: 28,
      title: format('sport.manualLabor'),
      icon: require('@assets/images/sports/manualLabor.png')
    },
    {
      id: 29,
      title: format('sport.martialArts'),
      icon: require('@assets/images/sports/martialArts.png')
    },
    {
      id: 30,
      title: format('sport.meditation'),
      icon: require('@assets/images/sports/meditation.png')
    },
    {
      id: 31,
      title: format('sport.motocross'),
      icon: require('@assets/images/sports/motocross.png')
    },
    {
      id: 32,
      title: format('sport.motorRacing'),
      icon: require('@assets/images/sports/motorRacing.png')
    },
    {
      id: 33,
      title: format('sport.mountainBiking'),
      icon: require('@assets/images/sports/mountainBiking.png')
    },
    {
      id: 34,
      title: format('sport.obstacleCourseRacing'),
      icon: require('@assets/images/sports/obstacleCourseRacing.png')
    },
    {
      id: 35,
      title: format('sport.paddle'),
      icon: require('@assets/images/sports/paddle.png')
    },
    {
      id: 36,
      title: format('sport.pilates'),
      icon: require('@assets/images/sports/pilates.png')
    },
    {
      id: 37,
      title: format('sport.pingPong'),
      icon: require('@assets/images/sports/pingPong.png')
    },
    {
      id: 38,
      title: format('sport.powerlifting'),
      icon: require('@assets/images/sports/powerlifting.png')
    },
    {
      id: 39,
      title: format('sport.rowing'),
      icon: require('@assets/images/sports/rowing.png')
    },
    {
      id: 40,
      title: format('sport.rugby'),
      icon: require('@assets/images/sports/rugby.png')
    },
    {
      id: 41,
      title: format('sport.running'),
      icon: require('@assets/images/sports/running.png')
    },
    {
      id: 42,
      title: format('sport.sailing'),
      icon: require('@assets/images/sports/sailing.png')
    },
    {
      id: 43,
      title: format('sport.shooting'),
      icon: require('@assets/images/sports/shooting.png')
    },
    {
      id: 44,
      title: format('sport.skate'),
      icon: require('@assets/images/sports/skate.png')
    },
    {
      id: 45,
      title: format('sport.skiing'),
      icon: require('@assets/images/sports/skiing.png')
    },
    {
      id: 46,
      title: format('sport.snowboard'),
      icon: require('@assets/images/sports/snowboard.png')
    },
    {
      id: 47,
      title: format('sport.soccer'),
      icon: require('@assets/images/sports/soccer.png')
    },
    {
      id: 48,
      title: format('sport.squash'),
      icon: require('@assets/images/sports/squash.png')
    },
    {
      id: 49,
      title: format('sport.stairs'),
      icon: require('@assets/images/sports/stairs.png')
    },
    {
      id: 50,
      title: format('sport.surfing'),
      icon: require('@assets/images/sports/surfing.png')
    },
    {
      id: 51,
      title: format('sport.swimming'),
      icon: require('@assets/images/sports/swimming.png')
    },
    {
      id: 52,
      title: format('sport.tennis'),
      icon: require('@assets/images/sports/tennis.png')
    },
    {
      id: 53,
      title: format('sport.trackField'),
      icon: require('@assets/images/sports/trackField.png')
    },
    {
      id: 54,
      title: format('sport.triathlon'),
      icon: require('@assets/images/sports/triathlon.png')
    },
    {
      id: 55,
      title: format('sport.ultimate'),
      icon: require('@assets/images/sports/ultimate.png')
    },
    {
      id: 56,
      title: format('sport.volleyball'),
      icon: require('@assets/images/sports/volleyball.png')
    },
    {
      id: 57,
      title: format('sport.walking'),
      icon: require('@assets/images/sports/walking.png')
    },
    {
      id: 58,
      title: format('sport.waterPolo'),
      icon: require('@assets/images/sports/waterPolo.png')
    },
    {
      id: 59,
      title: format('sport.weightlifting'),
      icon: require('@assets/images/sports/weightlifting.png')
    },
    {
      id: 60,
      title: format('sport.wrestling'),
      icon: require('@assets/images/sports/wrestling.png')
    },
    {
      id: 61,
      title: format('sport.yoga'),
      icon: require('@assets/images/sports/yoga.png')
    },
    
  ])
};
