export type UserRank =
    | 'Матрос'
    | 'Старший матрос'
    | 'Старшина 2-й статьи'
    | 'Старшина 1-й статьи'
    | 'Главный старшина'
    | 'Главный корабельный старшина'
    | 'Мичман'
    | 'Старший мичман'
    | 'Младший лейтенант'
    | 'Лейтенант'
    | 'Старший лейтенант'
    | 'Капитан-лейтенант'
    | 'Капитан 3-го ранга'
    | 'Капитан 2-го ранга'
    | 'Капитан 1-го ранга'
    | 'Контр-адмирал'
    | 'Вице-адмирал'
    | 'Адмирал'
    | 'Адмирал флота';

export const userRankKeys: UserRankKeys[] = [
    'sailor',
    'seniorSailor',
    'foreman2nd',
    'foreman1st',
    'chiefPettyOfficer',
    'chiefShipPettyOfficer',
    'midshipman',
    'seniorMidshipman',
    'juniorLieutenant',
    'lieutenant',
    'seniorLieutenant',
    'captainLieutenant',
    'captain3rdRank',
    'captain2ndRank',
    'captain1stRank',
    'rearAdmiral',
    'viceAdmiral',
    'admiral',
    'fleetAdmiral',
];

export type UserRankKeys =
    | 'sailor'
    | 'seniorSailor'
    | 'foreman2nd'
    | 'foreman1st'
    | 'chiefPettyOfficer'
    | 'chiefShipPettyOfficer'
    | 'midshipman'
    | 'seniorMidshipman'
    | 'juniorLieutenant'
    | 'lieutenant'
    | 'seniorLieutenant'
    | 'captainLieutenant'
    | 'captain3rdRank'
    | 'captain2ndRank'
    | 'captain1stRank'
    | 'rearAdmiral'
    | 'viceAdmiral'
    | 'admiral'
    | 'fleetAdmiral';

export const userRankMapper: Record<UserRankKeys, UserRank> = {
    sailor: 'Матрос',
    seniorSailor: 'Старший матрос',
    foreman2nd: 'Старшина 2-й статьи',
    foreman1st: 'Старшина 1-й статьи',
    chiefPettyOfficer: 'Главный старшина',
    chiefShipPettyOfficer: 'Главный корабельный старшина',
    midshipman: 'Мичман',
    seniorMidshipman: 'Старший мичман',
    juniorLieutenant: 'Младший лейтенант',
    lieutenant: 'Лейтенант',
    seniorLieutenant: 'Старший лейтенант',
    captainLieutenant: 'Капитан-лейтенант',
    captain3rdRank: 'Капитан 3-го ранга',
    captain2ndRank: 'Капитан 2-го ранга',
    captain1stRank: 'Капитан 1-го ранга',
    rearAdmiral: 'Контр-адмирал',
    viceAdmiral: 'Вице-адмирал',
    admiral: 'Адмирал',
    fleetAdmiral: 'Адмирал флота',
};
