import { OrganiazationNodeType } from '../components/organization-chart';

const orgiData:OrganiazationNodeType={key: '0',
    data: {label: 'F.C. Barcelona'},
    children: [
        {
            key: '0_0',
            data: {label: 'F.C. Barcelona'},
            children: [
                {
                    key: '0_0_0',
                    data: {label: 'Chelsea F.C.'}
                },
                {
                    key: '0_0_1',
                    data: {label: 'F.C. Barcelona'}
                }
            ]
        },
        {
            key: '0_1',
            data: {label: 'Real Madrid'},
            children: [
                {
                    key: '0_1_0',
                    data: {label: 'Bayern Munich'}
                },
                {
                    key: '0_1_1',
                    data: {label: 'Real Madrid'}
                }
            ]
        }
    ]
}
export default orgiData;