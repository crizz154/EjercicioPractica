import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Button, Card, Input, Label } from "../components/ui";
import { useTasks } from "../context/tasksContext";
import { Textarea } from "../components/ui/Textarea";
import { useForm } from "react-hook-form";
dayjs.extend(utc);

export function TaskFormPage() {
  const { createTask, getTask, updateTask } = useTasks();
  const navigate = useNavigate();
  const params = useParams();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      if (params.id) {
        // Actualizar la tarea
        await updateTask(params.id, {
          ...data,
          date: dayjs.utc(data.date).format(),
        });
        navigate("/tasks");  // Redirigir después de actualizar
      } else {
        // Crear una nueva tarea
        await createTask({
          ...data,
          date: dayjs.utc(data.date).format(),
        });
        navigate("/tasks");  // Redirigir después de crear
      }
    } catch (error) {
      console.log(error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  useEffect(() => {
    const loadTask = async () => {
      if (params.id) {
        try {
          const task = await getTask(params.id);
          setValue("title", task.title);
          setValue("description", task.description);
          setValue(
            "date",
            task.date ? dayjs(task.date).utc().format("YYYY-MM-DD") : ""
          );
          setValue("completed", task.completed);
        } catch (error) {
          console.error("Error fetching task:", error);
        }
      }
    };
    loadTask();
  }, [params.id, setValue]);  // Agregado `params.id` como dependencia

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          name="title"
          placeholder="Title"
          {...register("title", { required: "Title is required" })}
          autoFocus
        />
        {errors.title && (
          <p className="text-red-500 text-xs italic">{errors.title.message}</p>
        )}

        <Label htmlFor="description">Description</Label>
        <Textarea
          name="description"
          id="description"
          rows="3"
          placeholder="Description"
          {...register("description", { required: "Description is required" })}
        ></Textarea>

        <Label htmlFor="date">Date</Label>
        <Input type="date" name="date" {...register("date", { required: "Date is required" })} />
        {errors.date && (
          <p className="text-red-500 text-xs italic">{errors.date.message}</p>
        )}

        <Button type="submit" disabled={Object.keys(errors).length > 0}>Save</Button>
      </form>
    </Card>
  );
}
