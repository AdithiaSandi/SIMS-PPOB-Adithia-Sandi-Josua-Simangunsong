import { AtSignIcon, PencilIcon, UserIcon } from "lucide-react";
import Button from "../../components/Button";
import LayoutUser from "../../components/LayoutUser";
import { selectUser } from "../../store/selectors";
import { useSelector } from "react-redux";
import { useRef, useState, type FormEvent } from "react";
import clsx from "clsx";
import { useAppDispatch } from "../../store/hooks";
import { logout, updateUserProfile } from "../../store/slices/authSlice";
import {
  updateProfile,
  updateProfileImage,
  type User,
} from "../../apis/membership";
import { useMutation } from "@tanstack/react-query";
import type { TApiErrorResponse } from "../../apis";
import Toast from "../../components/Toast";
import Input from "../../components/Input";

const Profile = () => {
  const user = useSelector(selectUser);
  const [edit, setEdit] = useState<User | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  const { mutate: updateProfileData } = useMutation({
    mutationFn: (payload: User) => updateProfile(payload),
    onSuccess: (res) => {
      dispatch(updateUserProfile(res.data.data as User));
      setToast({
        message: res.data.message,
        variant: "success",
      });
      setEdit(undefined);
    },
    onError: (err: TApiErrorResponse) => {
      setToast({
        message: err.response?.data.message || "Failed to update profile",
        variant: "error",
      });
    },
  });

  const { mutate: updateProfileImageData } = useMutation({
    mutationFn: () => updateProfileImage(fileRef.current?.files?.[0] as File),
  });

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) return;
    if (edit?.profile_image !== user?.profile_image)
      updateProfileImageData(undefined, {
        onSuccess: (res) => {
          if (!res.data.data) throw new Error("Failed to update profile image");
          updateProfileData({
            ...(user as User),
            profile_image: res.data.data.profile_image,
          });
        },
        onError: (err) => {
          if (err instanceof Error) {
            setToast({
              message: err.message,
              variant: "error",
            });
          } else {
            setToast({
              message:
                (err as TApiErrorResponse).response?.data.message ||
                "Failed to update profile image",
              variant: "error",
            });
          }
        },
      });
    else updateProfileData(edit as User);
  };

  return (
    <LayoutUser
      withHeader={false}
      className="flex flex-col gap-10 relative max-w-[1000px] mx-auto w-full"
    >
      <div
        className={clsx(
          "relative w-fit mx-auto group",
          edit && "cursor-pointer"
        )}
        onClick={() => edit && fileRef.current?.click()}
      >
        <img
          src={
            (edit?.profile_image || user?.profile_image)?.includes("null") ||
            !(edit?.profile_image || user?.profile_image)
              ? "/assets/Profile Photo.png"
              : edit?.profile_image || user?.profile_image
          }
          alt=""
          width={150}
          height={150}
          className="rounded-full outline-[1px] outline-gray-100 aspect-square"
        />
        <input
          type="file"
          className="hidden"
          accept="image/jpeg, image/png"
          ref={fileRef}
          onChange={(e) => {
            if (e.target.files && edit) {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = (ev) => {
                if (ev.target?.result) {
                  setEdit((prev) => ({
                    ...(prev as User),
                    profile_image: ev.target?.result as string,
                  }));
                }
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        {edit && (
          <div className="absolute bottom-0 right-2 bg-white rounded-full w-fit p-2 border border-gray-100 opacity-50 group-hover:opacity-100 shadow-sm">
            <PencilIcon className="aspect-square" width={15} height={15} />
          </div>
        )}
      </div>
      <p className="text-center text-2xl font-semibold">
        {user?.first_name} {user?.last_name}
      </p>

      <form
        onSubmit={handleSave}
        ref={formRef}
        className="flex flex-col gap-10"
      >
        <div className="flex flex-col gap-5">
          <Input
            className="w-full"
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            value={edit ? edit.email : user?.email}
            required
            readOnly
            placeholder="Masukkan email anda"
            prefix={<AtSignIcon width={15} />}
            feedbackAlignment="end"
          />
          <Input
            className="w-full"
            name="first_name"
            label="Nama Depan"
            autoComplete="given-name"
            value={edit ? edit.first_name : user?.first_name}
            required
            readOnly={!edit}
            placeholder="Nama depan"
            prefix={<UserIcon width={15} />}
            feedbackAlignment="end"
            onChange={(e) =>
              setEdit((prev) => ({
                ...(prev as User),
                first_name: e.target.value,
              }))
            }
          />
          <Input
            className="w-full"
            name="last_name"
            label="Nama Belakang"
            autoComplete="family-name"
            value={edit ? edit.last_name : user?.last_name}
            required
            readOnly={!edit}
            placeholder="Nama belakang"
            prefix={<UserIcon width={15} />}
            feedbackAlignment="end"
            onChange={(e) =>
              setEdit((prev) => ({
                ...(prev as User),
                last_name: e.target.value,
              }))
            }
          />
        </div>
        <div className="flex flex-col gap-5">
          {!edit && (
            <Button
              type="button"
              variant="outline-danger"
              onClick={() => setEdit(user as User)}
            >
              Edit Profile
            </Button>
          )}
          <Button
            type={edit ? "submit" : "button"}
            variant="danger"
            onClick={() => !edit && handleLogout()}
          >
            {edit ? "Simpan" : "Logout"}
          </Button>
        </div>
      </form>
      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
    </LayoutUser>
  );
};

export default Profile;
