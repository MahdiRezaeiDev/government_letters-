import { Can } from '@/components/Can';
import { Button } from '@/components/ui/button';
import { PermissionEnum } from '@/Enums/PermissionEnum';

export default function NidList() {
    return (
        <div>
            {/* نمایش دکمه فقط اگر کاربر دسترسی ثبت تذکره داشته باشد */}
            <Can permission={PermissionEnum.NID_REGISTER}>
                <Button className="bg-green-600">
                    ثبت تذکره جدید
                </Button>
            </Can>

            {/* نمایش دکمه‌ها در جدول */}
            <table>
                <tbody>
                    {nids.map(nid => (
                        <tr key={nid.id}>
                            <td>{nid.title}</td>
                            <td>
                                <Can permission={PermissionEnum.NID_APPROVE}>
                                    <Button size="sm" variant="success">
                                        تأیید
                                    </Button>
                                </Can>

                                <Can permission={PermissionEnum.NID_DESTROY}>
                                    <Button size="sm" variant="danger">
                                        حذف
                                    </Button>
                                </Can>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}