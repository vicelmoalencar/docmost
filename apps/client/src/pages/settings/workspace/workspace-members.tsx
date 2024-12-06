import WorkspaceInviteModal from "@/features/workspace/components/members/components/workspace-invite-modal";
import {Group, SegmentedControl, Space, Text} from "@mantine/core";
import WorkspaceMembersTable from "@/features/workspace/components/members/components/workspace-members-table";
import SettingsTitle from "@/components/settings/settings-title.tsx";
import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import WorkspaceInvitesTable from "@/features/workspace/components/members/components/workspace-invites-table.tsx";
import useUserRole from "@/hooks/use-user-role.tsx";
import {getAppName} from "@/lib/config.ts";
import {Helmet} from "react-helmet-async";

export default function WorkspaceMembers() {
    const [segmentValue, setSegmentValue] = useState("members");
    const [searchParams] = useSearchParams();
    const {isAdmin} = useUserRole();
    const navigate = useNavigate();

    useEffect(() => {
        const currentTab = searchParams.get("tab");
        if (currentTab === "invites") {
            setSegmentValue(currentTab);
        }
    }, [searchParams.get("tab")]);

    const handleSegmentChange = (value: string) => {
        setSegmentValue(value);
        if (value === "invites") {
            navigate(`?tab=${value}`);
        } else {
            navigate("");
        }
    };

    return (
        <>
            <Helmet>
                <title>Members - {getAppName()}</title>
            </Helmet>
            <SettingsTitle title="Members"/>

            {/* <WorkspaceInviteSection /> */}
            {/* <Divider my="lg" /> */}

            <Group justify="space-between">
                <SegmentedControl
                    value={segmentValue}
                    onChange={handleSegmentChange}
                    data={[
                        {label: "Members", value: "members"},
                        {label: "Pending", value: "invites"},
                    ]}
                    withItemsBorders={false}
                />

                {isAdmin && <WorkspaceInviteModal/>}
            </Group>

            <Space h="lg"/>

            {segmentValue === "invites" ? (
                <WorkspaceInvitesTable/>
            ) : (
                <WorkspaceMembersTable/>
            )}
        </>
    );
}
