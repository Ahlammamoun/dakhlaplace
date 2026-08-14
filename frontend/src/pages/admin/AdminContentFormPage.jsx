import { useEffect, useState } from "react";
import {
    ArrowLeft,
    ImagePlus,
    Save,
    Trash2,
} from "lucide-react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    createAdminContent,
    deleteContentImage,
    getAdminContent,
    getCurrentUser,
    updateAdminContent,
    uploadContentImage,
} from "../../services/api";

import "./AdminContentFormPage.css";

const EMPTY_FORM = {
    title: "",
    slug: "",
    type: "place",
    subtitle: "",
    excerpt: "",
    content: "",
    address: "",
    phone: "",
    websiteUrl: "",
    latitude: "",
    longitude: "",
    isFeatured: false,
    isPublished: false,
    position: 0,
};

const TYPES = [
    {
        value: "place",
        label: "Lieu à découvrir",
    },
    {
        value: "activity",
        label: "Activité",
    },
    {
        value: "accommodation",
        label: "Hébergement",
    },
    {
        value: "restaurant",
        label: "Restaurant",
    },
    {
        value: "article",
        label: "Article du magazine",
    },
];

function createSlug(value) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export default function AdminContentFormPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEditing = Boolean(id);

    const [form, setForm] = useState(EMPTY_FORM);
    const [images, setImages] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imageAlt, setImageAlt] = useState("");
    const [imageCaption, setImageCaption] =
        useState("");
    const [slugEdited, setSlugEdited] =
        useState(false);
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        async function initializePage() {
            try {
                const session = await getCurrentUser();

                if (
                    !session?.user?.roles?.includes("ROLE_ADMIN")
                ) {
                    navigate("/admin/login", {
                        replace: true,
                    });

                    return;
                }

                if (!isEditing) {
                    setLoading(false);
                    return;
                }

                const data = await getAdminContent(id);
                const item = data.item;

                setForm({
                    title: item.title ?? "",
                    slug: item.slug ?? "",
                    type: item.type ?? "place",
                    subtitle: item.subtitle ?? "",
                    excerpt: item.excerpt ?? "",
                    content: item.content ?? "",
                    address: item.address ?? "",
                    phone: item.phone ?? "",
                    websiteUrl: item.websiteUrl ?? "",
                    latitude: item.latitude ?? "",
                    longitude: item.longitude ?? "",
                    isFeatured: Boolean(item.isFeatured),
                    isPublished: Boolean(item.isPublished),
                    position: item.position ?? 0,
                });

                setImages(item.images ?? []);
                setSlugEdited(true);
            } catch (requestError) {
                if (requestError.status === 401) {
                    navigate("/admin/login", {
                        replace: true,
                    });

                    return;
                }

                setError(
                    requestError.message ??
                    "Impossible de charger le contenu."
                );
            } finally {
                setLoading(false);
            }
        }

        initializePage();
    }, [id, isEditing, navigate]);

    function handleChange(event) {
        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        const nextValue =
            type === "checkbox" ? checked : value;

        setForm((currentForm) => {
            const nextForm = {
                ...currentForm,
                [name]: nextValue,
            };

            if (name === "title" && !slugEdited) {
                nextForm.slug = createSlug(value);
            }

            return nextForm;
        });
    }

    function handleSlugChange(event) {
        setSlugEdited(true);

        setForm((currentForm) => ({
            ...currentForm,
            slug: createSlug(event.target.value),
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const payload = {
                ...form,
                position: Number(form.position) || 0,
                latitude: form.latitude || null,
                longitude: form.longitude || null,
            };

            const response = isEditing
                ? await updateAdminContent(id, payload)
                : await createAdminContent(payload);

            const contentId = response.item.id;

            if (imageFile) {
                await uploadContentImage(
                    contentId,
                    imageFile,
                    {
                        altText:
                            imageAlt.trim() || form.title,
                        caption: imageCaption.trim(),
                        isMain: true,
                        position: 0,
                    }
                );
            }

            setSuccess(
                isEditing
                    ? "Contenu modifié avec succès."
                    : "Contenu créé avec succès."
            );

            window.setTimeout(() => {
                navigate("/admin");
            }, 600);
        } catch (requestError) {
            setError(
                requestError.message ??
                "Impossible d’enregistrer le contenu."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteImage(image) {
        const confirmed = window.confirm(
            "Supprimer définitivement cette image ?"
        );

        if (!confirmed) {
            return;
        }

        setError("");

        try {
            await deleteContentImage(id, image.id);

            setImages((currentImages) =>
                currentImages.filter(
                    (currentImage) =>
                        currentImage.id !== image.id
                )
            );
        } catch (requestError) {
            setError(
                requestError.message ??
                "Impossible de supprimer cette image."
            );
        }
    }

    if (loading) {
        return (
            <main className="admin-form-loading">
                Chargement du contenu…
            </main>
        );
    }

    return (
        <main className="admin-content-form-page">
            <header className="admin-form-header">
                <button
                    type="button"
                    onClick={() => navigate("/admin")}
                >
                    <ArrowLeft size={19} />
                    Retour
                </button>

                <div>
                    <span>Administration</span>
                    <h1>
                        {isEditing
                            ? "Modifier le contenu"
                            : "Ajouter un contenu"}
                    </h1>
                </div>
            </header>

            <form
                className="admin-content-form"
                onSubmit={handleSubmit}
            >
                {error && (
                    <div className="admin-form-message error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="admin-form-message success">
                        {success}
                    </div>
                )}

                <section className="admin-form-section">
                    <div className="admin-form-section-heading">
                        <span>01</span>
                        <div>
                            <h2>Informations principales</h2>
                            <p>
                                Présentez clairement ce contenu aux
                                visiteurs.
                            </p>
                        </div>
                    </div>

                    <div className="admin-form-grid">
                        <label className="admin-field full">
                            Titre *
                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label className="admin-field">
                            Slug *
                            <input
                                name="slug"
                                value={form.slug}
                                onChange={handleSlugChange}
                                required
                            />
                        </label>

                        <label className="admin-field">
                            Type *
                            <select
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                            >
                                {TYPES.map((type) => (
                                    <option
                                        key={type.value}
                                        value={type.value}
                                    >
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="admin-field full">
                            Sous-titre
                            <input
                                name="subtitle"
                                value={form.subtitle}
                                onChange={handleChange}
                            />
                        </label>

                        <label className="admin-field full">
                            Extrait
                            <textarea
                                name="excerpt"
                                value={form.excerpt}
                                onChange={handleChange}
                                rows={3}
                            />
                        </label>

                        <label className="admin-field full">
                            Contenu
                            <textarea
                                name="content"
                                value={form.content}
                                onChange={handleChange}
                                rows={9}
                            />
                        </label>
                    </div>
                </section>

                <section className="admin-form-section">
                    <div className="admin-form-section-heading">
                        <span>02</span>
                        <div>
                            <h2>Coordonnées et localisation</h2>
                            <p>
                                Ces informations restent facultatives.
                            </p>
                        </div>
                    </div>

                    <div className="admin-form-grid">
                        <label className="admin-field full">
                            Adresse
                            <input
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                            />
                        </label>

                        <label className="admin-field">
                            Téléphone
                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                            />
                        </label>

                        <label className="admin-field">
                            Site internet
                            <input
                                type="url"
                                name="websiteUrl"
                                value={form.websiteUrl}
                                onChange={handleChange}
                            />
                        </label>

                        <label className="admin-field">
                            Latitude
                            <input
                                type="number"
                                step="any"
                                min="-90"
                                max="90"
                                name="latitude"
                                value={form.latitude}
                                onChange={handleChange}
                                placeholder="Exemple : 23.7136"
                            />
                        </label>

                        <label className="admin-field">
                            Longitude
                            <input
                                type="number"
                                step="any"
                                min="-180"
                                max="180"
                                name="longitude"
                                value={form.longitude}
                                onChange={handleChange}
                                placeholder="Exemple : -15.9350"
                            />
                        </label>
                    </div>
                </section>

                <section className="admin-form-section">
                    <div className="admin-form-section-heading">
                        <span>03</span>
                        <div>
                            <h2>Image principale</h2>
                            <p>
                                Formats JPG, PNG, WebP ou AVIF, maximum
                                8 Mo.
                            </p>
                        </div>
                    </div>

                    {images.length > 0 && (
                        <div className="admin-existing-images">
                            {images.map((image) => (
                                <article key={image.id}>
                                    <img
                                        src={image.url}
                                        alt={image.altText ?? form.title}
                                    />

                                    <div>
                                        <strong>
                                            {image.isMain
                                                ? "Image principale"
                                                : "Image"}
                                        </strong>
                                        <span>
                                            {image.caption ||
                                                image.altText ||
                                                image.fileName}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteImage(image)
                                        }
                                        aria-label="Supprimer l’image"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </article>
                            ))}
                        </div>
                    )}

                    <div className="admin-image-upload">
                        <ImagePlus size={30} />

                        <label>
                            Sélectionner une image
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/avif"
                                onChange={(event) =>
                                    setImageFile(
                                        event.target.files?.[0] ?? null
                                    )
                                }
                            />
                        </label>

                        {imageFile && (
                            <strong>{imageFile.name}</strong>
                        )}
                    </div>

                    <div className="admin-form-grid">
                        <label className="admin-field">
                            Texte alternatif
                            <input
                                value={imageAlt}
                                onChange={(event) =>
                                    setImageAlt(event.target.value)
                                }
                            />
                        </label>

                        <label className="admin-field">
                            Légende
                            <input
                                value={imageCaption}
                                onChange={(event) =>
                                    setImageCaption(event.target.value)
                                }
                            />
                        </label>
                    </div>
                </section>

                <section className="admin-form-section">
                    <div className="admin-form-section-heading">
                        <span>04</span>
                        <div>
                            <h2>Publication</h2>
                            <p>
                                Définissez la visibilité et l’ordre
                                d’affichage.
                            </p>
                        </div>
                    </div>

                    <div className="admin-publication-row">
                        <label>
                            <input
                                type="checkbox"
                                name="isPublished"
                                checked={form.isPublished}
                                onChange={handleChange}
                            />
                            Publier ce contenu
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                name="isFeatured"
                                checked={form.isFeatured}
                                onChange={handleChange}
                            />
                            Mettre en avant
                        </label>

                        <label className="admin-field position">
                            Position
                            <input
                                type="number"
                                min="0"
                                name="position"
                                value={form.position}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                </section>

                <div className="admin-form-actions">
                    <button
                        type="button"
                        className="secondary"
                        onClick={() => navigate("/admin")}
                    >
                        Annuler
                    </button>

                    <button
                        type="submit"
                        className="primary"
                        disabled={saving}
                    >
                        <Save size={19} />
                        {saving
                            ? "Enregistrement…"
                            : "Enregistrer"}
                    </button>
                </div>
            </form>
        </main>
    );
}