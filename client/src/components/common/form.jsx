import * as Select from "@radix-ui/react-select";
import { Label } from "../ui/label";   
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {
  function renderInputByComponentType(control) {
    const value = formData[control.name] || '';

    switch (control.componentType) {
      case "input":
        return (
          <Input
            name={control.name}
            placeholder={control.placeholder}
            id={control.name}
            type={control.type}
            value={value || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                [control.name]: e.target.value,
              })
            }
          />
        );

      case "select":
        return (
          <Select.Root
           value={value} 
            onValueChange={(val) =>
              setFormData({
                ...formData,
                [control.name]: val,
              })
            }
          >
            <Select.Trigger className="w-full border p-2 rounded flex items-center justify-between bg-white">
              <Select.Value placeholder={`Select ${control.label}`} />
              <Select.Icon className="ml-2">▼</Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content
                position="popper"
                className="bg-white border rounded shadow z-[9999] w-[--radix-select-trigger-width]"
              >
                <Select.Viewport>
                  {control.options?.map((optionItem) => (
                    <Select.Item
                      key={optionItem.id}
                      value={optionItem.id}
                      className="p-2 cursor-pointer hover:bg-gray-100 outline-none"
                    >
                      <Select.ItemText>{optionItem.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        );

      case "textarea":
        return (
          <Textarea
            name={control.name}
            placeholder={control.placeholder}
            id={control.name}
            value={value || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                [control.name]: e.target.value,
              })
            }
          />
        );

      default:
        return (
          <Input
            name={control.name}
            placeholder={control.placeholder}
            id={control.name}
            type={control.type}
            value={value || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                [control.name]: e.target.value,
              })
            }
          />
        );
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((control) => (
          <div className="grid w-full gap-1.5" key={control.name}>
            <Label htmlFor={control.name} className="mb-1">
              {control.label}
            </Label>
            {renderInputByComponentType(control)}
          </div>
        ))}
      </div>

      <Button  disabled= {isBtnDisabled} type="submit" className="mt-2 w-full bg-black text-white">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;