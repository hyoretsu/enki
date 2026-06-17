import { useDialogStore } from "@/stores/dialog";
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from "baseui/modal";
import { useTranslation } from "react-i18next";

export function ConfirmDialog() {
	const { t } = useTranslation();
	const { close, current } = useDialogStore();

	if (!current) return null;

	const isConfirm = current.type === "confirm";

	return (
		<Modal
			animate
			autoFocus
			isOpen
			onClose={() => close(false)}
			overrides={{
				DialogContainer: {
					style: {
						backdropFilter: "blur(4px)",
						backgroundColor: "rgba(0,0,0,0.55)",
					},
				},
				Dialog: {
					style: {
						maxWidth: "420px",
						width: "92vw",
					},
				},
				Root: {
					style: { zIndex: 9999 },
				},
			}}
			role={ROLE.alertdialog}
			size={SIZE.auto}
		>
			{current.title && <ModalHeader>{current.title}</ModalHeader>}
			<ModalBody>
				<span className="whitespace-pre-line">{current.message}</span>
			</ModalBody>
			<ModalFooter>
				{isConfirm && (
					<ModalButton kind="tertiary" onClick={() => close(false)}>
						{t("actions.cancel", { defaultValue: "Cancel" })}
					</ModalButton>
				)}
				<ModalButton autoFocus onClick={() => close(true)}>
					{isConfirm
						? (current.confirmLabel ?? t("actions.confirm", { defaultValue: "Confirm" }))
						: t("actions.ok", { defaultValue: "OK" })}
				</ModalButton>
			</ModalFooter>
		</Modal>
	);
}
